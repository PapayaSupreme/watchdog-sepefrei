export default function DownAlert({ downCount }) {
  if (downCount === 0) {
    return null;
  }

  return (
    <div className="alert">
      {downCount} monitor{downCount > 1 ? 's are' : ' is'} currently down.
    </div>
  );
}

