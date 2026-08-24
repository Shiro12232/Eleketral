import { About } from "./_components/about";
import Car3d from "./_components/car3d";
import { Services } from "./_components/services";
import { Buildcar } from "./_components/buildcar";


import Navbar from './_components/navbar';
export default function Page() {
  return (
    <main>
      <Car3d />
      <About />
      <Buildcar />
      <Services/>
      
      <Navbar />
    </main>
  );
}