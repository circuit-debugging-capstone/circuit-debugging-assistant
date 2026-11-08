import logo from "../assets/logo.jpg";

export default function Header() {
  return (
    <header>
      <div className="flex items-center gap-4 p-4">
        <img src={logo} alt="logo" className="h-15 w-15 object-contain"/>
        <h2 className="text-2xl font-bold">CircuitDebugger</h2>
        <h4 className="text-sm font-bold">Helps you debug your circuits</h4>
      </div>
    </header>
  );
}