// Reglas de cálculo del sistema de notas (escala vigesimal 0 - 20)
// Promedio final = P1×10% + P2×20% + P3×20% + Examen final×30% + Prom. continuas×20%

export const PESOS = {
  parcial_1: 0.1,
  parcial_2: 0.2,
  parcial_3: 0.2,
  examen_final: 0.3,
  continuas: 0.2,
}

export const NOTA_APROBATORIA = 10.5

// Convierte "15" → 15. Si el input está vacío o es inválido devuelve 0
export function aNumero(valor) {
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : 0
}

// Promedio de continuas = suma de todas / número de continuas
export function calcularPromedioContinuas(notas) {
  if (!notas || notas.length === 0) return 0
  const suma = notas.reduce((total, nota) => total + aNumero(nota), 0)
  return suma / notas.length
}

export function calcularPromedioFinal({ parcial_1, parcial_2, parcial_3, examen_final, continuas }) {
  const promedioContinuas = calcularPromedioContinuas(continuas)

  const detalle = [
    { nombre: 'Parcial 1', nota: aNumero(parcial_1), peso: PESOS.parcial_1 },
    { nombre: 'Parcial 2', nota: aNumero(parcial_2), peso: PESOS.parcial_2 },
    { nombre: 'Parcial 3', nota: aNumero(parcial_3), peso: PESOS.parcial_3 },
    { nombre: 'Examen final', nota: aNumero(examen_final), peso: PESOS.examen_final },
    { nombre: 'Prom. continuas', nota: promedioContinuas, peso: PESOS.continuas },
  ].map((item) => ({ ...item, aporte: item.nota * item.peso }))

  const promedioFinal = detalle.reduce((total, item) => total + item.aporte, 0)

  return {
    promedioContinuas,
    promedioFinal,
    detalle,
    aprobado: promedioFinal >= NOTA_APROBATORIA,
  }
}

// Muestra siempre 2 decimales: 14.5 → "14.50"
export function formatearNota(numero) {
  return aNumero(numero).toFixed(2)
}