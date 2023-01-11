import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();


    navigate("/tracker")


}

export default Home;