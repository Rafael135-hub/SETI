export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen gap-16">
      <img src="/images/cat-astronaut.gif" alt="Cute Lost Astronaut Cat" className="w-130" />

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold text-white mb-4 text-[210px]">404</h1>
        <p className="text-[22px] text-white max-w-76 text-center font-light">
          Opa Tripulante, parece que você se perdeu no hiperespaço, o que você acha de voltar à base?
        </p>
      </div>
      
    </div>
  );
}