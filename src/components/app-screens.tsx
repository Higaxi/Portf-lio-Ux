import Image from "next/image";

const screens = [
  {
    src: "/projetos/hora-do-lar/app-ponto.png",
    alt: "Tela Marcar o ponto do app do funcionário: saudação, data, botões Marcar o ponto e Resumo do mês, campos de entrada, intervalo, retorno e saída, e o botão Registrar entrada.",
    caption: "Marcar o ponto",
  },
  {
    src: "/projetos/hora-do-lar/app-resumo.png",
    alt: "Tela Resumo do mês: horas trabalhadas contra a meta mensal, extrato de horas extras, resumo de descontos, saldo, atrasos e faltas.",
    caption: "Resumo do mês",
  },
  {
    src: "/projetos/hora-do-lar/app-menu.png",
    alt: "Menu do app: ajuste de ponto, documentos mensais, documentos periódicos, desligamento e configuração.",
    caption: "Menu",
  },
];

/** Capturas reais (pequenas) do app do funcionário, em molduras de celular. */
export function AppScreens() {
  return (
    <figure>
      <ul className="flex flex-wrap justify-center gap-6 rounded-2xl bg-surface p-6 sm:justify-start md:p-8">
        {screens.map((s) => (
          <li key={s.src} className="flex flex-col items-center">
            <div className="overflow-hidden rounded-[1.4rem] border-[6px] border-[#0b0b0f] bg-white">
              <Image src={s.src} alt={s.alt} width={144} height={296} unoptimized loading="eager" className="block h-[296px] w-[144px]" />
            </div>
            <span className="label mt-3">{s.caption}</span>
          </li>
        ))}
      </ul>
      <figcaption className="label mt-3">Telas atuais do app do funcionário (capturas do app publicado, em tamanho original).</figcaption>
    </figure>
  );
}
