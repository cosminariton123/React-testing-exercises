//import Onboarding from "../components/Onboarding";
import SearchBox from "../components/SearchBox";

const PlaygroundPage = () => {
  return <SearchBox onChange={(text) => console.log(text)}></SearchBox>;
};

export default PlaygroundPage;
