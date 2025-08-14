import HomeActive from "../icons_active/HomeActive";

const Home = ({ active, ...props }) => {
  if (active) return <HomeActive {...props} />;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      fill="none"
      {...props}
    >
      <path
        stroke="#000"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.005 15.545a2.997 2.997 0 1 1 5.995 0V21h7V10.543L11 1 1 10.543V21h7.005v-5.455Z"
      />
    </svg>
  );
};

export default Home