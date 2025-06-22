import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import './tech.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const skillGraphs = [
  {
    header: 'Programming & Scripting',
    captions: [
      'Python',
      'Latex',
      'Shell Scripting',
      'Docker Compose',
      'Terraform AWS',
      'C/C++/Java',
      'Python Flask',
      'Python Qt5',
      'MCP & Agentic AI'
    ],
    values: [0.9, 0.9, 0.7, 0.7, 0.7, 0.5, 0.5, 0.5, 0.7]
  },
  {
    header: 'Technologies & Tools',
    captions: [
      'Nmap',
      'Wireshark',
      'Metasploit',
      'Burp Suite',
      'TexStudio',
      'Docker Compose',
      'Terraform',
      'AWS',
      'Git'
    ],
    values: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.7, 0.7, 0.9]
  },
  {
    header: 'AI & Agentic Design',
    captions: [
      'LLM (ChatGPT, LLama2)',
      'RAG & Agentic AI',
      'LangChain',
      'Prompt Engineering',
      'RAG Ops'
    ],
    values: [0.7, 0.7, 0.6, 0.6, 0.6]
  },
  {
    header: 'Research & Supporting Skills',
    captions: [
      'LaTeX',
      'TexStudio',
      'Ontologies',
      'GitHub',
      'Documentation',
      'Scientific Writing',
      'Zotero'
    ],
    values: [0.9, 0.9, 0.6, 0.8, 0.9, 0.8, 0.7]
  }
];

const TechGraph = () => {
  return (
    <section id="tech-graph">
      <h2>My Skill Graphs</h2>
      <div className="graph__container">
        {skillGraphs.map((set, index) => {
          const data = {
            labels: set.captions,
            datasets: [
              {
                label: set.header,
                data: set.values.map(v => v * 100),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
              }
            ]
          };

          const options = {
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  display: false
                },
                grid: {
                  color: '#444'
                },
                pointLabels: {
                  font: {
                    size: 14
                  },
                  color: '#fff'
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#fff'
                }
              }
            }
          };

          return (
            <div key={index} className="graph__item">
              <Radar data={data} options={options} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TechGraph;
