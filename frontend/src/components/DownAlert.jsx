// Displays a warning banner for active outages (downCount) and returns null when all monitors are up.
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

