import zxcvbn from "zxcvbn";

export function PasswordForceText(text: string) {
  const force = zxcvbn(text);
  switch (force.score) {
    case 0:
      return "Muito fraca";
    case 1:
      return "Fraca";
    case 2:
      return "Média";
    case 3:
      return "Forte";
    case 4:
      return "Muito forte";
  }
}

export function PasswordForceGraphic({ text }: { text: string }) {
  const force = zxcvbn(text);

  function renderForce() {
    const forceDivs = [];
    for (let i = -1; i < force.score; i++) {
      forceDivs.push(
        <div key={i} className="bg-primary rounded-xl w-1/5 h-1"></div>
      );
    }
    return forceDivs;
  }

  return <div className="flex gap-2">{renderForce()}</div>;
}
