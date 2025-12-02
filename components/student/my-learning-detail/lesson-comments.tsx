import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, Send } from "lucide-react";
import { Comment } from "@/lib/mock-courses";
import Image from "next/image";
import { useState } from "react";

interface LessonCommentsProps {
  comments: Comment[];
}

export function LessonComments({ comments }: LessonCommentsProps) {
  const [newComment, setNewComment] = useState("");

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Input */}
      <div className="mb-8 pb-8 border-b">
        <p className="text-sm text-muted-foreground mb-3">
          Share your thoughts about this lesson
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="text-sm"
          />
          <Button size="sm" disabled={!newComment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 pb-4 border-b last:border-b-0"
            >
              <div className="flex-shrink-0">
                <Image
                  src={comment.avatar || "/placeholder.svg"}
                  alt={comment.author}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {comment.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {comment.timestamp}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground mt-2">{comment.text}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
