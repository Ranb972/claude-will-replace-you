import { useParams } from "react-router-dom";

export function ResultPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Your Replacement Result</h1>
        <p className="text-gray-400">Result ID: {id}</p>
      </div>
    </div>
  );
}
