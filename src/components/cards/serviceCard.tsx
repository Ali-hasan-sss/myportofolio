import "./cards.css";
interface serviceCardProops {
  title: string;
  des?: string;
  image: string;
  link?: string;
}
export default function ServiceCard({
  title,
  des,
  image,
  link,
}: serviceCardProops) {
  return (
    <div className="card1">
      <div className="card-container">
        <div className="card-face front-face">
          <img src={image} alt="me" />
          <h2>{title}</h2>
          <h3>{des}</h3>
        </div>
        <div className="card-face back-face">
          <div className="continer-about">
            <h2>Abut service:</h2>
            <p>I can build a website by using HTML , CSS and Java script</p>
            <a href={link} target="blank" className="text-xl font-bold">
              visit website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
