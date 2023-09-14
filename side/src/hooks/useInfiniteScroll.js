import {useState, useEffect} from "react";

function useInfiniteScroll(callback) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
        setIsFetching(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isFetching) return;

    callback().then(() => {
      setIsFetching(false);
    });
  }, [isFetching, callback]);

  return [isFetching];
}

export default useInfiniteScroll;
