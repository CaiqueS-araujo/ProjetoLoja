export const WA_OWNER  = "5524988240332";
export const INSTA     = "anaju.vie_design";
export const PIX_KEY   = "cf2a82b5-883a-4251-bb83-d8c8724cd8e4";
export const ADMIN_PW  = import.meta.env.VITE_ADMIN_PW;

export const WDAYS  = ["D", "S", "T", "Q", "Q", "S", "S"];
export const MFULL  = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const MSHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export const DEFAULT_THEME = {
  primary: "#9b7adb",
  deep:    "#2a1a4a",
  accent:  "#7055aa",
  bg:      "#faf8ff",
  light:   "#f5f0ff",
  border:  "#e0d5f5",
  font:    "'Trebuchet MS','Segoe UI',sans-serif",
};

export const DEFAULT_PROFILE = {
  name:         "Anna Vieira",
  role:         "Lash & Brow Designer",
  bio:          "Apaixonada por realçar a beleza natural de cada cliente com técnica, cuidado e precisão. Especialista em extensão de cílios fio a fio e design de sobrancelhas personalizado.",
  heroPhoto:    "",
  heroMode:     "gradient",
  heroTitle:    "Anna\nVieira",
  heroSubtitle: '"Um olhar pode dizer tudo"',
  aboutPhoto:   "",
  address:      "Estrada União e Indústria, 10677 - Itaipava, Petrópolis - RJ, 25730-740",
  instagram:    INSTA,
  pixKey:       PIX_KEY,
  policy:       "📌 Política de Agendamento\n\n• Para confirmar o horário, é necessário o pagamento de 50% do valor do procedimento.\n• Cancelamentos não têm reembolso do sinal.\n• Remarcações devem ser feitas com pelo menos 24h de antecedência.\n• Em caso de falta ou atraso superior a 15 minutos, o sinal será perdido.\n\nObrigada pela compreensão! 🤍✨",
};

export const DEFAULT_MSGS = {
  clientConfirm: "🌸 Olá {nome}!\n\nSeu agendamento foi confirmado! ✨\n\n📅 Data: {data}\n⏰ Horário: {hora}\n💅 Serviço: {servico}\n💰 Valor total: {valor}\n💳 Sinal pago (50%): {sinal}\n\nFico te esperando! Qualquer dúvida me chame 💕\n\n— Anna Vieira ✦",
  ownerNotify:   "🌸 *Novo Agendamento!*\n\n👤 {nome}\n📞 {telefone}\n📅 {data}\n⏰ {hora}\n💅 {servico}\n💰 {valor}\n💳 Sinal (50%): {sinal}\n✅ Pix realizado\n{obs}",
  reminder:      "Olá {nome}! 🌸\n\nLembrando do seu horário amanhã:\n📅 {data} às {hora}\n💅 {servico}\n\nQualquer dúvida me chame! 💕\n— Anna Vieira ✦",
};

export const INIT_SVCS = [
  { id:1, cat:"cilios",      name:"Volume Brasileiro",    price:130, dur:120, color:"#9b7adb", desc:"Fio a fio com técnica clássica. Volume natural, cílios saudáveis e duradouros.",   photo:"https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&q=80", maint:[{l:"15 dias",p:65},{l:"20 dias",p:85},{l:"+25 dias",p:130}] },
  { id:2, cat:"cilios",      name:"Volume Egípcio",       price:150, dur:120, color:"#7055aa", desc:"Estilo dramático e marcante. Olhar intenso, poderoso e sofisticado.",              photo:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80", maint:[{l:"15 dias",p:75},{l:"20 dias",p:100},{l:"+25 dias",p:150}] },
  { id:3, cat:"cilios",      name:"Fox Eyes",             price:175, dur:120, color:"#9b7adb", desc:"Efeito raposa — alongado e elevado nas extremidades. Sedutor e felino.",           photo:"https://images.unsplash.com/photo-1567721913486-6585f069b332?w=500&q=80", maint:[{l:"15 dias",p:87},{l:"20 dias",p:115},{l:"+25 dias",p:175}] },
  { id:4, cat:"cilios",      name:"Efeito Sirena",        price:130, dur:90,  color:"#6baad4", desc:"Abertura central para um olhar encantador e magnético.",                           photo:"https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&q=80", maint:[{l:"até 15 dias",p:60}] },
  { id:5, cat:"cilios",      name:"Express Brasileiro",   price:100, dur:60,  color:"#c4a0e0", desc:"70% dos fios. Ideal para primeira vez ou resultado sutil.",                       photo:"", maint:[] },
  { id:6, cat:"cilios",      name:"Express Egípcio",      price:100, dur:60,  color:"#a080c0", desc:"Versão rápida do volume egípcio. Olhar marcante em menos tempo.",                photo:"", maint:[] },
  { id:7, cat:"sobrancelha", name:"Design Personalizado", price:40,  dur:45,  color:"#c4a0e0", desc:"Análise facial exclusiva. Sobrancelhas harmônicas que valorizam seu rosto.",      photo:"https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&q=80", maint:[] },
  { id:8, cat:"sobrancelha", name:"Design com Henna",     price:60,  dur:60,  color:"#a07850", desc:"Design + henna para preencher falhas e efeito de maquiagem natural.",             photo:"", maint:[] },
  { id:9, cat:"sobrancelha", name:"Brow Lamination",      price:120, dur:75,  color:"#b09080", desc:"Alinha e direciona os fios com efeito lifting moderno e volumoso.",               photo:"", maint:[] },
];

export const THEME_PRESETS = [
  { name:"💜 Lilás Suave",    primary:"#9b7adb", deep:"#2a1a4a", accent:"#7055aa", bg:"#faf8ff", light:"#f5f0ff", border:"#e0d5f5" },
  { name:"🌹 Rosa Dourado",   primary:"#d4956a", deep:"#3a2418", accent:"#a06040", bg:"#fdf8f4", light:"#faf3ed", border:"#ecddd5" },
  { name:"🌸 Rosa Claro",     primary:"#d4888a", deep:"#3a1a1a", accent:"#b06060", bg:"#fff5f5", light:"#fff0f0", border:"#f0d0d0" },
  { name:"🌿 Verde Esmeralda",primary:"#5a9a7a", deep:"#1a3a2a", accent:"#3a7a5a", bg:"#f4faf7", light:"#edf8f3", border:"#c8e8d8" },
  { name:"🖤 Preto Elegante", primary:"#c9a07a", deep:"#111",    accent:"#888",    bg:"#1a1a1a", light:"#242424", border:"#333"    },
  { name:"🧡 Terracota",      primary:"#c9614a", deep:"#3a1a0a", accent:"#a04030", bg:"#fff8f5", light:"#fff0ec", border:"#f0d5cc" },
  { name:"🩵 Azul Bebê",      primary:"#6aaccf", deep:"#1a3050", accent:"#4a8ab0", bg:"#f4f9fd", light:"#edf5fb", border:"#c5e0f0" },
  { name:"☁️ Minimal",        primary:"#888",    deep:"#222",    accent:"#666",    bg:"#ffffff", light:"#f8f8f8", border:"#e8e8e8" },
];

export const FONT_OPTIONS = [
  { name:"Padrão (Trebuchet)", val:"'Trebuchet MS','Segoe UI',sans-serif" },
  { name:"Georgia (Clássica)", val:"Georgia,'Times New Roman',serif"      },
  { name:"Arial (Moderna)",    val:"Arial,Helvetica,sans-serif"           },
  { name:"Verdana (Legível)",  val:"Verdana,Geneva,sans-serif"            },
  { name:"Courier (Mono)",     val:"'Courier New',Courier,monospace"      },
];
