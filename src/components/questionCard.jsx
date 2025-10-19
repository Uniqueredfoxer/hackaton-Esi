import { FaUser } from "react-icons/fa";
import { FiThumbsUp, FiThumbsDown, FiMessageCircle } from "react-icons/fi";
import { useState } from "react";

const QuestionCard = ({ post }) => {
  const [score, setScore] = useState(post.score || 0);
  const [userVote, setUserVote] = useState(0); // -1, 0, 1

  const handleVote = (v) => {
    if (userVote === v) {
      setScore((s) => s - v);
      setUserVote(0);
      return;
    }
    // switch vote
    setScore((s) => s - userVote + v);
    setUserVote(v);
  };

  return (
    <div className="border border-[#bdbdbd25] bg-[#222] p-4 rounded-md w-fit">
      <div className="flex items-center gap-4">
        <div className="text-gray-300">
          <div className="text-xs text-gray-400">{post.course}</div>
          <h3 className="text-lg font-bold text-[hsl(0_0%_95%)]">{post.title}</h3>
          <div className="text-sm text-gray-400 mt-1">{post.content}</div>
          <div className="flex items-center gap-3 mt-3 text-sm text-gray-400">
            <div className="inline-flex items-center"><FaUser className="mr-1"/> {post.author}</div>
            <div className="inline-flex items-center"><FiMessageCircle className="mr-1"/> {post.comments}</div>
          </div>
        </div>

        <div className="flex flex-col flex-grow items-center justify-center gap-2">
          <button onClick={() => handleVote(1)} className={`px-3 py-2 rounded-md ${userVote===1 ? 'bg-green-700 text-white' : 'bg-[#111] text-gray-200 border border-[#2b2b2b]'}`}><FiThumbsUp/></button>
          <div className="text-sm text-gray-300">{score}</div>
          <button onClick={() => handleVote(-1)} className={`px-3 py-2 rounded-md ${userVote===-1 ? 'bg-red-700 text-white' : 'bg-[#111] text-gray-200 border border-[#2b2b2b]'}`}><FiThumbsDown/></button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
