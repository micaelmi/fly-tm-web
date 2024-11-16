import { FlagBannerFold } from "@phosphor-icons/react/dist/ssr";

export default function ClubStepIndicator({ step }: { step: number }) {
  return (
    <div className="">
      <div className="flex justify-center items-center p-4 rounded-md">
        {/* Linha que conecta os círculos */}
        <div className="relative flex items-center w-full">
          {/* Linha principal */}
          <div className="absolute inset-0 flex items-center">
            {/* Primeira barra conectando os círculos */}
            <div
              className={`border-white ${step > 1 ? "bg-blue-500" : ""} border w-1/2 h-2`}
            ></div>

            {/* Segunda barra conectando os círculos */}
            <div
              className={`border-white ${step === 3 ? "bg-blue-500" : ""} border w-1/2 h-2`}
            ></div>
          </div>

          {/* Círculo 1 */}
          <div className="relative z-10 flex justify-center items-center border-white bg-blue-500 border rounded-full w-10 h-10 font-bold text-blue-950 text-lg">
            1
          </div>

          {/* Espaço entre os círculos */}
          <div className="flex-1"></div>

          {/* Círculo 2 */}
          <div
            className={`relative z-10 flex justify-center items-center border border-white rounded-full w-10 h-10 font-bold text-lg ${
              step >= 2 ? "bg-blue-500 text-blue-950" : "bg-blue-950 text-white"
            }`}
          >
            2
          </div>

          {/* Espaço entre os círculos */}
          <div className={`flex-1 ${step < 3 && "bg-blue-950"}`}></div>

          {/* Círculo com ícone de check */}
          <div
            className={`relative z-10 flex justify-center items-center border border-white rounded-full w-10 h-10 font-bold text-lg ${
              step === 3
                ? "bg-green-500 text-blue-950"
                : "bg-blue-950 text-green-500 border-green-500"
            }`}
          >
            <FlagBannerFold size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
