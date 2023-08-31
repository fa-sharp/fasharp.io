import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function Greeting({
  messages,
  fontSize = "2rem",
}: {
  messages: string[];
  fontSize?: string;
}) {
  const randomMessage = () =>
    messages[Math.floor(Math.random() * messages.length)];

  const [greeting, setGreeting] = useState("");
  useEffect(() => setGreeting(randomMessage()), []);

  return (
    <div>
      <h3>
        <button
          style={{
            background: 0,
            border: 0,
            padding: 0,
            textDecoration: "underline",
            fontSize,
            cursor: "pointer",
            color: "rgb(105 154 173)",
          }}
          onClick={() => setGreeting(randomMessage())}
        >
          {greeting}
        </button>
      </h3>
    </div>
  );
}
