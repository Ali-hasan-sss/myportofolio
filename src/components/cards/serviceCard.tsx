import "./cards.css";
import { ExternalLink, Code } from "lucide-react";

interface serviceCardProops {
  title: string;
  des?: string;
  image: string;
  projectUrl?: string;
  codeUrl?: string;
}

export default function ServiceCard({
  title,
  des,
  image,
  projectUrl,
  codeUrl,
}: serviceCardProops) {
  return (
    <div className="card1">
      <div className="card-container">
        <div className="card-face front-face">
          <img src={image} alt="me" className="w-full" />
          <h2 className="text-white">{title}</h2>
          <h3>{des}</h3>
        </div>
        <div className="card-face back-face">
          <div className="continer-about">
            <h2>About project:</h2>
            <p>You can visit the website and view the code..</p>
            <div className="flex flex-col gap-2 mt-4">
              {projectUrl && (
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              )}
              {codeUrl && (
                <a
                  href={codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  View Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
