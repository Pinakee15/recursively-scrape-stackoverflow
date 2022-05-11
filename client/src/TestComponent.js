import { Link } from "react-router-dom";

const TestComponent = () => {
  return (
    <div>
      I'm on tet component
      <br />
      <br />
      <Link to="/">Go back to home screen</Link>
    </div>
  );
};

export default TestComponent;
