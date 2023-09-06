import { useState } from "preact/hooks";

export default function Greeting({
  messages,
  fontSize = "2rem",
  color = "rgb(35 134 176)",
}: {
  messages: string[];
  fontSize?: string;
  color?: string;
}) {
  const randomMessage = () =>
    messages[Math.floor(Math.random() * messages.length)];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div>
      <h1>
        <button
          style={{
            background: 0,
            border: 0,
            padding: 0,
            cursor: "pointer",
            fontSize,
            textDecoration: "underline",
            color,
          }}
          onClick={() => setGreeting(randomMessage())}
        >
          {greeting}
        </button>
      </h1>
    </div>
  );
}
