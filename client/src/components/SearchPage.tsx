import { useParams } from "react-router-dom";

const SearchPage = () => {
  const params = useParams();
  alert(params.text);
  return <div>SearchPage ({params.text})</div>;
};
export default SearchPage;
