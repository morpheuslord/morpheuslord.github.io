// Level data for the infra-ops game (ported from the InfraOpsGameV2 design).
// Each level: nodes [id, type, label, gx, gy, resourceAddr?],
// wires [from, to, kind, label, elbow('x'|'y'), missionIdxs?], terraform files,
// missions (misconfigurations to fix) and guards (traffic that must keep working).

export type Blocks = Record<string, string>;

export interface Helpers {
  sub: (block: string, name: string) => string[];
  val: (block: string, key: string) => string | null;
  open: (block: string, port: string) => boolean;
}

export interface Mission {
  label: string;
  file: string;
  res: string;
  nodes: string[];
  route: string[] | null;
  hint: string;
  ok: (R: Blocks, h: Helpers) => unknown;
}

export interface Guard {
  label: string;
  node: string;
  routes: string[][];
  ok: (R: Blocks, h: Helpers) => unknown;
}

export type NodeRow = [string, string, string, number, number, string?];
export type WireRow = [string, string, string, string, string?, number[]?];

export interface Level {
  a: string;
  b: string;
  roleA: string;
  roleB: string;
  brief: string;
  nodes: NodeRow[];
  wires: WireRow[];
  files: Record<string, string>;
  missions: Mission[];
  guards: Guard[];
}

const T = (a: string[]) => a.join('\n');

interface SgRule { d: string; p: number; cidr: string; c?: string }
const SG = (name: string, rules: SgRule[]) =>
  T([
    `resource "aws_security_group" "${name}" {`,
    `  name = "${name}-sg"`,
    ...rules.flatMap((r) => [
      '',
      ...(r.c ? [`  # ${r.c}`] : []),
      '  ingress {',
      `    description = "${r.d}"`,
      `    from_port   = ${r.p}`,
      `    to_port     = ${r.p}`,
      '    protocol    = "tcp"',
      `    cidr_blocks = ["${r.cidr}"]`,
      '  }',
    ]),
    '}',
  ]);

const POL = (role: string, action: string, resource: string) =>
  T([
    `resource "aws_iam_role_policy" "${role}" {`,
    `  role = aws_iam_role.${role.replace('_write', '')}.id`,
    '  policy = jsonencode({',
    '    Statement = [{',
    '      Effect   = "Allow"',
    `      Action   = ${action}`,
    `      Resource = ${resource}`,
    '    }]',
    '  })',
    '}',
  ]);

const LISTENER = (ssl?: string) =>
  T([
    'resource "aws_lb_listener" "https" {',
    '  load_balancer_arn = aws_lb.main.arn',
    '  port              = 443',
    '  protocol          = "HTTPS"',
    ...(ssl ? [`  ssl_policy        = "${ssl}"`] : []),
    '}',
  ]);

export const LEVELS: Level[] = [
  {
    a: 'Open', b: 'Door', roleA: 'Security Groups', roleB: 'Bastion · ALB · Monitoring',
    brief: 'Two web nodes, a bastion and a Prometheus box. Someone opened SSH and the node exporter to the world "for an hour" during an incident. Close them without cutting off HTTPS or the ops VPN.',
    nodes: [['inet', 'inet', 'internet', 0, 2.6], ['alb', 'alb', 'edge-alb', 2, 1.2, 'aws_lb_listener.https'], ['bastion', 'server', 'bastion', 2, 4.2, 'aws_security_group.bastion'], ['web1', 'server', 'web-01', 4, 0.8, 'aws_security_group.web'], ['web2', 'server', 'web-02', 4, 2.8, 'aws_security_group.web'], ['prom', 'server', 'prometheus', 6, 2, 'aws_instance.prometheus']],
    wires: [['inet', 'alb', 'net', ':443'], ['alb', 'web1', 'net', ''], ['alb', 'web2', 'net', ':443'], ['inet', 'bastion', 'net', ':22 vpn', 'x', [2]], ['bastion', 'web2', 'net', ':22'], ['prom', 'web1', 'net', ':9100', 'y'], ['prom', 'web2', 'net', ''], ['inet', 'web1', 'risk', ':22 world', 'y', [0]], ['inet', 'web2', 'risk', ':9100 world', 'x', [1]]],
    files: {
      'network.tf': T(['# acme-0423 · 10.0.0.0/16', 'resource "aws_vpc" "main" {', '  cidr_block = "10.0.0.0/16"', '}', '', 'resource "aws_subnet" "public" {', '  vpc_id     = aws_vpc.main.id', '  cidr_block = "10.0.1.0/24"', '}', '', 'resource "aws_subnet" "private" {', '  vpc_id     = aws_vpc.main.id', '  cidr_block = "10.0.2.0/24"', '}']),
      'lb.tf': T(['resource "aws_lb" "main" {', '  name     = "edge-alb"', '  internal = false', '  subnets  = [aws_subnet.public.id]', '}', '', LISTENER()]),
      'compute.tf': T(['resource "aws_instance" "web_01" {', '  instance_type          = "t3.small"', '  subnet_id              = aws_subnet.private.id', '  vpc_security_group_ids = [aws_security_group.web.id]', '}', '', 'resource "aws_instance" "web_02" {', '  instance_type          = "t3.small"', '  subnet_id              = aws_subnet.private.id', '  vpc_security_group_ids = [aws_security_group.web.id]', '}', '', 'resource "aws_instance" "bastion" {', '  instance_type          = "t3.micro"', '  subnet_id              = aws_subnet.public.id', '  vpc_security_group_ids = [aws_security_group.bastion.id]', '}', '', 'resource "aws_instance" "prometheus" {', '  instance_type = "t3.medium"', '  subnet_id     = aws_subnet.private.id', '}']),
      'security.tf': SG('web', [{ d: 'https from alb', p: 443, cidr: '10.0.1.0/24' }, { d: 'ssh debug', p: 22, cidr: '0.0.0.0/0', c: 'TODO: remove after incident INC-2231' }, { d: 'node exporter', p: 9100, cidr: '0.0.0.0/0' }]) + '\n\n' + SG('bastion', [{ d: 'ssh', p: 22, cidr: '0.0.0.0/0' }]),
    },
    missions: [
      { label: 'SSH :22 on web nodes open to 0.0.0.0/0', file: 'security.tf', res: 'aws_security_group.web', nodes: ['web1', 'web2'], route: ['inet', 'web1'], hint: 'Delete the "ssh debug" ingress block. Admins already come in through the bastion.', ok: (R, h) => R['aws_security_group.web'] && !h.open(R['aws_security_group.web'], '22') },
      { label: 'Node exporter :9100 public', file: 'security.tf', res: 'aws_security_group.web', nodes: ['web1', 'web2'], route: ['inet', 'web2'], hint: 'Prometheus lives in the private subnet: cidr_blocks = ["10.0.2.0/24"]', ok: (R, h) => R['aws_security_group.web'] && !h.open(R['aws_security_group.web'], '9100') },
      { label: 'Bastion SSH open to the whole internet', file: 'security.tf', res: 'aws_security_group.bastion', nodes: ['bastion'], route: ['inet', 'bastion'], hint: 'Restrict to the office VPN: cidr_blocks = ["203.0.113.0/24"]', ok: (R, h) => R['aws_security_group.bastion'] && !h.open(R['aws_security_group.bastion'], '22') },
    ],
    guards: [
      { label: 'HTTPS reaches web-01 and web-02 via the ALB', node: 'web2', routes: [['inet', 'alb', 'web1'], ['inet', 'alb', 'web2']], ok: (R, h) => R['aws_lb_listener.https'] && h.val(R['aws_lb_listener.https'], 'port') === '443' && R['aws_security_group.web'] && h.sub(R['aws_security_group.web'], 'ingress').some((b) => h.val(b, 'from_port') === '443') },
      { label: 'Ops can still SSH to the bastion over VPN', node: 'bastion', routes: [['inet', 'bastion']], ok: (R, h) => R['aws_security_group.bastion'] && h.sub(R['aws_security_group.bastion'], 'ingress').some((b) => h.val(b, 'from_port') === '22') },
    ],
  },
  {
    a: 'Leaky', b: 'Bucket', roleA: 'S3 · CloudFront', roleB: 'Bucket policy · OAC · IAM',
    brief: 'Clients download their scan reports through CloudFront, but the bucket behind it is also public. Make CloudFront the only way in, force HTTPS, and keep the scanner able to write.',
    nodes: [['inet', 'inet', 'internet', 0, 2.8], ['cdn', 'cdn', 'cloudfront', 0, 0.6, 'aws_cloudfront_distribution.reports'], ['role', 'iam', 'scanner-role', 4, 2.2, 'aws_iam_role_policy.scanner_write'], ['scanner', 'server', 'scanner', 4, 4.2, 'aws_iam_role.scanner'], ['reports', 's3', 'scan-reports', 6, 0.8, 'aws_s3_bucket.reports'], ['logs', 's3', 'access-logs', 6, 3.6, 'aws_s3_bucket.access_logs']],
    wires: [['inet', 'cdn', 'net', ':443'], ['cdn', 'reports', 'data', 'OAC origin'], ['inet', 'reports', 'risk', 'public GET', 'x', [0, 1, 2]], ['scanner', 'role', 'iam', 'assume'], ['role', 'reports', 'iam', 'PutObject'], ['reports', 'logs', 'data', 'access logs']],
    files: {
      's3.tf': T(['resource "aws_s3_bucket" "reports" {', '  bucket = "acme-0423-scan-reports"', '  acl    = "public-read"', '}', '', 'resource "aws_s3_bucket_public_access_block" "reports" {', '  bucket                  = aws_s3_bucket.reports.id', '  block_public_acls       = false', '  block_public_policy     = false', '  restrict_public_buckets = true', '}', '', 'resource "aws_s3_bucket_policy" "reports" {', '  bucket = aws_s3_bucket.reports.id', '  policy = jsonencode({', '    Statement = [{', '      Effect    = "Allow"', '      Principal = "*"', '      Action    = "s3:GetObject"', '      Resource  = "${aws_s3_bucket.reports.arn}/*"', '    }]', '  })', '}', '', 'resource "aws_s3_bucket" "access_logs" {', '  bucket = "acme-0423-access-logs"', '}']),
      'cdn.tf': T(['resource "aws_cloudfront_distribution" "reports" {', '  enabled = true', '', '  origin {', '    domain_name              = aws_s3_bucket.reports.bucket_regional_domain_name', '    origin_access_control_id = aws_cloudfront_origin_access_control.reports.id', '  }', '', '  default_cache_behavior {', '    target_origin_id       = "reports"', '    viewer_protocol_policy = "allow-all"', '  }', '}']),
      'iam.tf': T(['resource "aws_iam_role" "scanner" {', '  name = "scanner-task-role"', '}', '', POL('scanner_write', '["s3:PutObject"]', '"${aws_s3_bucket.reports.arn}/*"')]),
    },
    missions: [
      { label: 'Bucket ACL is public-read', file: 's3.tf', res: 'aws_s3_bucket.reports', nodes: ['reports'], route: ['inet', 'reports'], hint: 'acl = "private"', ok: (R, h) => R['aws_s3_bucket.reports'] && !/public/.test(h.val(R['aws_s3_bucket.reports'], 'acl') || '') },
      { label: 'Public access block disabled', file: 's3.tf', res: 'aws_s3_bucket_public_access_block.reports', nodes: ['reports'], route: ['inet', 'reports'], hint: 'Set block_public_acls and block_public_policy to true.', ok: (R, h) => { const b = R['aws_s3_bucket_public_access_block.reports']; return b && h.val(b, 'block_public_acls') === 'true' && h.val(b, 'block_public_policy') === 'true'; } },
      { label: 'Bucket policy grants Principal "*"', file: 's3.tf', res: 'aws_s3_bucket_policy.reports', nodes: ['reports'], route: ['inet', 'reports'], hint: 'Only CloudFront: Principal = { Service = "cloudfront.amazonaws.com" }. Don\'t delete the policy, because OAC needs it.', ok: (R, h) => { const p = R['aws_s3_bucket_policy.reports']; return !p || (h.val(p, 'Principal') || '*') !== '*'; } },
      { label: 'CloudFront serves over plain HTTP', file: 'cdn.tf', res: 'aws_cloudfront_distribution.reports', nodes: ['cdn'], route: ['inet', 'cdn'], hint: 'viewer_protocol_policy = "redirect-to-https"', ok: (R, h) => { const c = R['aws_cloudfront_distribution.reports']; return c && /https/.test(h.val(c, 'viewer_protocol_policy') || ''); } },
    ],
    guards: [
      { label: 'Clients download reports via CloudFront', node: 'reports', routes: [['inet', 'cdn', 'reports']], ok: (R, h) => R['aws_cloudfront_distribution.reports'] && h.sub(R['aws_cloudfront_distribution.reports'], 'origin').length > 0 && !!R['aws_s3_bucket_policy.reports'] },
      { label: 'Scanner uploads through its role', node: 'reports', routes: [['scanner', 'role', 'reports']], ok: (R) => !!R['aws_iam_role_policy.scanner_write'] && /s3:PutObject/.test(R['aws_iam_role_policy.scanner_write']) },
    ],
  },
  {
    a: 'Exposed', b: 'Database', roleA: 'RDS · KMS', roleB: 'Secrets Manager · Replicas',
    brief: 'The platform database has a public endpoint, a wide-open security group, no encryption and a password in git. Lock it down without breaking the API or the read replica.',
    nodes: [['inet', 'inet', 'internet', 0, 2.4], ['alb', 'alb', 'edge-alb', 2, 1.4, 'aws_lb_listener.https'], ['app', 'ecs', 'platform-api', 4, 1.4, 'aws_ecs_service.app'], ['secrets', 'secrets', 'db-secret', 4, 3.8, 'aws_secretsmanager_secret.db'], ['rds', 'rds', 'platform-db', 6, 0.9, 'aws_db_instance.main'], ['replica', 'rds', 'db-replica', 6, 3.1, 'aws_db_instance.replica'], ['kms', 'kms', 'db-key', 6, 5.2, 'aws_kms_key.db']],
    wires: [['inet', 'alb', 'net', ':443'], ['alb', 'app', 'net', ':8080'], ['app', 'rds', 'net', ':5432'], ['rds', 'replica', 'data', 'replication'], ['inet', 'rds', 'risk', ':5432 world', 'y', [0, 1]], ['app', 'secrets', 'iam', 'GetSecretValue'], ['replica', 'kms', 'kms', 'encrypt'], ['secrets', 'kms', 'kms', '']],
    files: {
      'rds.tf': T(['resource "aws_db_instance" "main" {', '  identifier          = "platform-db"', '  engine              = "postgres"', '  instance_class      = "db.r6g.large"', '  username            = "platform"', '  password            = "Summer2024!"', '  publicly_accessible = true', '  storage_encrypted   = false', '}', '', 'resource "aws_db_instance" "replica" {', '  identifier          = "platform-db-replica"', '  replicate_source_db = aws_db_instance.main.identifier', '  instance_class      = "db.r6g.large"', '}']),
      'security.tf': T(['resource "aws_security_group" "app" {', '  name = "app-sg"', '}', '', SG('db', [{ d: 'postgres', p: 5432, cidr: '0.0.0.0/0' }])]),
      'kms.tf': T(['resource "aws_kms_key" "db" {', '  description         = "platform-db at-rest key"', '  enable_key_rotation = true', '}', '', 'resource "aws_secretsmanager_secret" "db" {', '  name = "platform/db"', '}']),
      'app.tf': T(['resource "aws_ecs_service" "app" {', '  name            = "platform-api"', '  desired_count   = 3', '  security_groups = [aws_security_group.app.id]', '}', '', LISTENER()]),
    },
    missions: [
      { label: 'DB has a public endpoint', file: 'rds.tf', res: 'aws_db_instance.main', nodes: ['rds'], route: ['inet', 'rds'], hint: 'publicly_accessible = false', ok: (R, h) => R['aws_db_instance.main'] && h.val(R['aws_db_instance.main'], 'publicly_accessible') === 'false' },
      { label: 'Postgres :5432 open to 0.0.0.0/0', file: 'security.tf', res: 'aws_security_group.db', nodes: ['rds', 'replica'], route: ['inet', 'rds'], hint: 'Keep the rule, since the API needs it. Scope it to the private subnet: cidr_blocks = ["10.0.2.0/24"]', ok: (R, h) => R['aws_security_group.db'] && !h.open(R['aws_security_group.db'], '5432') },
      { label: 'Storage not encrypted with the KMS key', file: 'rds.tf', res: 'aws_db_instance.main', nodes: ['rds', 'kms'], route: null, hint: 'storage_encrypted = true and kms_key_id = aws_kms_key.db.arn', ok: (R, h) => { const d = R['aws_db_instance.main']; return d && h.val(d, 'storage_encrypted') === 'true' && /aws_kms_key\.db/.test(h.val(d, 'kms_key_id') || ''); } },
      { label: 'Master password committed in plaintext', file: 'rds.tf', res: 'aws_db_instance.main', nodes: ['rds', 'secrets'], route: null, hint: 'Delete the password line and add manage_master_user_password = true', ok: (R, h) => { const d = R['aws_db_instance.main']; return d && !h.val(d, 'password') && h.val(d, 'manage_master_user_password') === 'true'; } },
    ],
    guards: [
      { label: 'API reaches Postgres on :5432', node: 'rds', routes: [['inet', 'alb', 'app', 'rds']], ok: (R, h) => R['aws_db_instance.main'] && R['aws_security_group.db'] && h.sub(R['aws_security_group.db'], 'ingress').some((b) => h.val(b, 'from_port') === '5432') },
      { label: 'Read replica stays in sync', node: 'replica', routes: [['rds', 'replica']], ok: (R) => !!R['aws_db_instance.replica'] && !!R['aws_db_instance.main'] },
    ],
  },
  {
    a: 'Metadata', b: 'Heist', roleA: 'IMDS · IAM · WAF', roleB: 'SSRF · Least privilege',
    brief: 'An SSRF in the scan UI can reach 169.254.169.254 and steal the instance role, which allows "*" on "*". Block the payload at the edge, require IMDSv2 and shrink the role. Uploads must keep working.',
    nodes: [['inet', 'inet', 'internet', 0, 3.2], ['waf', 'waf', 'edge-acl', 0, 1.1, 'aws_wafv2_web_acl.edge'], ['alb', 'alb', 'edge-alb', 2, 1.1, 'aws_lb_listener.https'], ['scanner', 'server', 'scanner', 4, 1.1, 'aws_instance.scanner'], ['imds', 'imds', 'imds', 4, 3.2, 'aws_instance.scanner'], ['role', 'iam', 'instance-role', 6, 3.2, 'aws_iam_role_policy.scanner'], ['reports', 's3', 'scan-reports', 6, 1.1], ['kms', 'kms', 'all-keys', 6, 5.2]],
    wires: [['inet', 'waf', 'net', ':443'], ['waf', 'alb', 'net', ''], ['alb', 'scanner', 'net', ':8443'], ['scanner', 'imds', 'risk', 'SSRF', 'x', [1]], ['imds', 'role', 'iam', 'creds'], ['role', 'reports', 'iam', 's3:*'], ['role', 'kms', 'iam', 'kms:*'], ['scanner', 'reports', 'data', 'upload']],
    files: {
      'waf.tf': T(['resource "aws_wafv2_web_acl" "edge" {', '  name  = "edge-acl"', '  scope = "REGIONAL"', '', '  default_action {', '    allow {}', '  }', '', '  rule {', '    name     = "AWSManagedRulesKnownBadInputsRuleSet"', '    priority = 1', '', '    # was set to count while tuning false positives', '    override_action {', '      count {}', '    }', '  }', '}']),
      'compute.tf': T(['resource "aws_instance" "scanner" {', '  ami                  = "ami-0abc1234"', '  instance_type        = "t3.large"', '  iam_instance_profile = aws_iam_instance_profile.scanner.name', '', '  metadata_options {', '    http_endpoint               = "enabled"', '    http_tokens                 = "optional"', '    http_put_response_hop_limit = 2', '  }', '}']),
      'iam.tf': T(['resource "aws_iam_role" "scanner" {', '  name = "scanner-instance-role"', '}', '', POL('scanner', '"*"', '"*"')]),
      'lb.tf': LISTENER(),
    },
    missions: [
      { label: 'WAF bad-inputs rule only counts', file: 'waf.tf', res: 'aws_wafv2_web_acl.edge', nodes: ['waf'], route: ['inet', 'waf'], hint: 'In override_action, replace count {} with none {} so the managed rule blocks.', ok: (R, h) => { const w = R['aws_wafv2_web_acl.edge']; return w && h.sub(w, 'override_action').some((b) => /none/.test(b) && !/count/.test(b)); } },
      { label: 'IMDSv1 allowed (SSRF → credentials)', file: 'compute.tf', res: 'aws_instance.scanner', nodes: ['imds', 'scanner'], route: ['inet', 'waf', 'alb', 'scanner', 'imds'], hint: 'http_tokens = "required" (IMDSv2). Bonus: set the hop limit to 1.', ok: (R, h) => R['aws_instance.scanner'] && h.sub(R['aws_instance.scanner'], 'metadata_options').some((b) => h.val(b, 'http_tokens') === 'required') },
      { label: 'Role allows Action "*"', file: 'iam.tf', res: 'aws_iam_role_policy.scanner', nodes: ['role', 'kms'], route: ['inet', 'waf', 'alb', 'scanner', 'imds', 'role', 'kms'], hint: 'Action = ["s3:PutObject"]', ok: (R, h) => R['aws_iam_role_policy.scanner'] && (h.val(R['aws_iam_role_policy.scanner'], 'Action') || '*') !== '*' },
      { label: 'Role allows Resource "*"', file: 'iam.tf', res: 'aws_iam_role_policy.scanner', nodes: ['role', 'reports'], route: ['inet', 'waf', 'alb', 'scanner', 'imds', 'role', 'reports'], hint: 'Resource = "arn:aws:s3:::acme-0423-scan-reports/*"', ok: (R, h) => R['aws_iam_role_policy.scanner'] && (h.val(R['aws_iam_role_policy.scanner'], 'Resource') || '*') !== '*' },
    ],
    guards: [
      { label: 'Clients reach the scan UI through the WAF', node: 'scanner', routes: [['inet', 'waf', 'alb', 'scanner']], ok: (R, h) => R['aws_lb_listener.https'] && h.val(R['aws_lb_listener.https'], 'port') === '443' && !!R['aws_wafv2_web_acl.edge'] },
      { label: 'Scanner can still upload reports', node: 'reports', routes: [['scanner', 'reports']], ok: (R, h) => { const r = R['aws_iam_role_policy.scanner'], a = (r && h.val(r, 'Action')) || ''; return !!r && (a === '*' || /s3:(PutObject|\*)/.test(a)); } },
    ],
  },
  {
    a: 'Nothing', b: 'Leaves', roleA: 'VPC Endpoints · CloudTrail', roleB: 'Egress · TLS',
    brief: 'The promise: nothing a client scans ever leaves their account. Remove the internet egress, route S3 through the endpoint, harden TLS and make the audit trail tamper-evident.',
    nodes: [['inet', 'inet', 'internet', 0, 2.4], ['alb', 'alb', 'edge-alb', 2, 1, 'aws_lb_listener.https'], ['nat', 'nat', 'nat-gw', 2, 4.4, 'aws_route.scanner_egress'], ['app', 'ecs', 'dashboard', 4, 1], ['scanner', 'server', 'scanner', 4, 3], ['vpce', 'vpce', 's3-endpoint', 4, 5, 'aws_vpc_endpoint.s3'], ['trail', 'trail', 'org-trail', 6, 0.5, 'aws_cloudtrail.org'], ['kms', 'kms', 'audit-key', 6, 1.9], ['reports', 's3', 'scan-reports', 6, 3.4]],
    wires: [['inet', 'alb', 'net', ':443'], ['alb', 'app', 'net', ''], ['app', 'scanner', 'data', 'jobs'], ['scanner', 'nat', 'risk', '0.0.0.0/0', 'x', [0]], ['nat', 'inet', 'risk', 'egress', 'x', [0]], ['scanner', 'vpce', 'net', ''], ['vpce', 'reports', 'data', 'private', 'x'], ['app', 'trail', 'data', 'audit', 'x'], ['trail', 'kms', 'kms', '']],
    files: {
      'network.tf': T(['resource "aws_route_table" "private" {', '  vpc_id = aws_vpc.main.id', '}', '', 'resource "aws_nat_gateway" "main" {', '  subnet_id = aws_subnet.public.id', '}', '', '# "temporary": needed for pip install in 2022', 'resource "aws_route" "scanner_egress" {', '  route_table_id         = aws_route_table.private.id', '  destination_cidr_block = "0.0.0.0/0"', '  nat_gateway_id         = aws_nat_gateway.main.id', '}']),
      'endpoints.tf': T(['resource "aws_vpc_endpoint" "s3" {', '  vpc_id            = aws_vpc.main.id', '  service_name      = "com.amazonaws.us-east-1.s3"', '  vpc_endpoint_type = "Gateway"', '  route_table_ids   = []', '}']),
      'lb.tf': LISTENER('ELBSecurityPolicy-2016-08'),
      'logging.tf': T(['resource "aws_cloudtrail" "org" {', '  name                       = "org-trail"', '  s3_bucket_name             = aws_s3_bucket.audit.id', '  kms_key_id                 = aws_kms_key.audit.arn', '  is_multi_region_trail      = true', '  enable_log_file_validation = false', '}']),
    },
    missions: [
      { label: 'Scanner subnet routes 0.0.0.0/0 via NAT', file: 'network.tf', res: 'aws_route.scanner_egress', nodes: ['nat', 'scanner'], route: ['scanner', 'nat', 'inet'], hint: 'Delete the aws_route "scanner_egress" block entirely.', ok: (R) => { const r = R['aws_route.scanner_egress']; return !r || !(r.includes('0.0.0.0/0') && r.includes('nat_gateway_id')); } },
      { label: 'S3 endpoint not attached to any route table', file: 'endpoints.tf', res: 'aws_vpc_endpoint.s3', nodes: ['vpce'], route: null, hint: 'route_table_ids = [aws_route_table.private.id]', ok: (R, h) => { const e = R['aws_vpc_endpoint.s3'], v = e && h.val(e, 'route_table_ids'); return !!v && !/^\[\s*\]$/.test(v); } },
      { label: 'ALB still negotiates TLS 1.0', file: 'lb.tf', res: 'aws_lb_listener.https', nodes: ['alb'], route: ['inet', 'alb'], hint: 'ssl_policy = "ELBSecurityPolicy-TLS13-1-2-2021-06"', ok: (R, h) => R['aws_lb_listener.https'] && /TLS13/.test(h.val(R['aws_lb_listener.https'], 'ssl_policy') || '') },
      { label: 'CloudTrail log validation disabled', file: 'logging.tf', res: 'aws_cloudtrail.org', nodes: ['trail'], route: null, hint: 'enable_log_file_validation = true', ok: (R, h) => R['aws_cloudtrail.org'] && h.val(R['aws_cloudtrail.org'], 'enable_log_file_validation') === 'true' },
    ],
    guards: [
      { label: 'Clients reach the dashboard on :443', node: 'app', routes: [['inet', 'alb', 'app']], ok: (R, h) => R['aws_lb_listener.https'] && h.val(R['aws_lb_listener.https'], 'port') === '443' },
      { label: 'Scanner reaches S3 through the endpoint', node: 'reports', routes: [['scanner', 'vpce', 'reports']], ok: (R, h) => R['aws_vpc_endpoint.s3'] && /s3/.test(h.val(R['aws_vpc_endpoint.s3'], 'service_name') || '') },
    ],
  },
];
