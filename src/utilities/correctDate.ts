export function toCorrectDate(fecha:string) :string{
  const fechStr = fecha!.toString()
  const fecIns = fechStr!.split('-')
  return `${fecIns[2]}-${fecIns[1]}-${fecIns[0]}`;
}
