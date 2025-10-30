import supabase from "../services/supabase";
import { fetchPosts } from "../services/postServices";
import QuestionCard from "./questionCard";
import { useState, useEffect } from "react";

const TopQuestions = () => {
  const [posts, setPostd] = useState([]);

  useEffect(() => {
    const getTopPosts = async () => {
      try {
        const data = await supabase.from("posts").select("*").filter().limit(4);
      } catch {}
    };
  }, []);
};
