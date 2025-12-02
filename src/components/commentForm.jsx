import { useState } from "react";
import { Send, X } from "lucide-react";

const CommentForm = ({
  onSubmit,
  onCancel,
  placeholder = "Partagez votre réponse...",
  autoFocus = false,
  initialValue = "",
}) => {
  const [content, setContent] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onSubmit(content.trim());
      setContent("");
    } catch (error) {
      console.error(error);
      // Error is handled by parent component
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full h-20 bg-[#2b2b2b] border border-[#3d3d3d] rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#6953FF] text-sm"
        autoFocus={autoFocus}
        disabled={submitting}
      />

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        )}

        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="flex items-center gap-2 bg-[#6953FF] hover:bg-[#5a47e0] disabled:bg-[#2b2b2b] disabled:text-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Send className="w-4 h-4" />
          {submitting ? "Envoi..." : "Commenter"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
