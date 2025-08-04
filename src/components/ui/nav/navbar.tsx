const NavBar = () => {
  return (
    <nav className="absolute left-0 top-0 z-50 w-full font-radar text-3xl">
      <div className="flex w-full justify-between px-12 pt-12">
        <div>Katalyst - 2025</div>
        <div className="relative uppercase before:absolute before:left-[1.6rem] before:top-0 before:h-full before:w-4 before:rounded-full before:content-['']">
          <a href="" className="block">
            Home
          </a>
          <a href="" className="block">
            About
          </a>
        </div>
      </div>
    </nav>
  );
};

export { NavBar };
