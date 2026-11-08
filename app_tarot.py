import streamlit as st
import secrets
from openai import OpenAI

# =====================================================================
# 1. CONFIGURACIÓN DE LA PÁGINA
# =====================================================================
st.set_page_config(
    page_title="Oráculo de la Psique - Noruf_Labs",
    page_icon="🔮",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# AJUSTES SUTILES EN LA BARRA LATERAL
st.sidebar.subheader("⚙️ Ajustes Avanzados")
permitir_invertidas = st.sidebar.checkbox("Permitir cartas invertidas", value=True)

# =====================================================================
# 2. BASE DE DATOS DE ARCANOS MAYORES (22 CARTAS COMPLETAS)
# =====================================================================
ARCANOS_MAYORES = {
    "0": {"nombre": "El Loco", "arquetipo": "El Impulso Ciego", "upright": "Nuevos caminos, saltos de fe, inicio de una aventura inesperada. Libertad absoluta.", "reversed": "Irresponsabilidad, andar a ciegas, dar pasos en falso o huir de la realidad por inmadurez."},
    "1": {"nombre": "El Mago", "arquetipo": "El Alquimista", "upright": "Capacidad para manifestar, inteligencia práctica, todas las herramientas listas para usarse.", "reversed": "Talento desperdiciado, trucos, manipulación, promesas falsas o indecisión paralizante."},
    "2": {"nombre": "La Sacerdotisa", "arquetipo": "La Inacción Sabia", "upright": "Secretos por revelar, intuición profunda, paciencia. Tiempo de maduración en silencio.", "reversed": "Intenciones ocultas que dañan, frialdad, superficialidad o ignorar la verdad que ya sabes."},
    "3": {"nombre": "La Emperatriz", "arquetipo": "La Fuerza Creativa", "upright": "Abundancia, crecimiento, fertilidad en proyectos o relaciones. Expresión artística.", "reversed": "Bloqueo, dependencia de otros, tiranía emocional o derroche de energía sin rumbo."},
    "4": {"nombre": "El Emperador", "arquetipo": "La Estructura", "upright": "Estabilidad, protección, situación con poder y límites claros. Autoridad sólida.", "reversed": "Rigidez mental extrema, tiranía, control asfixiante o caos total por falta de disciplina."},
    "5": {"nombre": "El Hierofante", "arquetipo": "El Guía Espiritual", "upright": "Tradición, educación, búsqueda de significado, mentoría y respeto por las normas.", "reversed": "Dogmatismo, rebelión contra la autoridad, rigidez institucional o consejos hipócritas."},
    "6": {"nombre": "Los Enamorados", "arquetipo": "La Elección", "upright": "Alineación de valores, decisiones cruciales del corazón, armonía en relaciones y encrucijadas.", "reversed": "Desalineación, conflicto interno, malas elecciones afectivas o falta de compromiso."},
    "7": {"nombre": "El Carro", "arquetipo": "La Voluntad Dirigida", "upright": "Éxito por esfuerzo, determinación, control sobre fuerzas opuestas y avance firme.", "reversed": "Falta de dirección, pérdida de control, agresividad desmedida o estancamiento."},
    "8": {"nombre": "La Fuerza", "arquetipo": "El Dominio Interior", "upright": "Coraje, paciencia, compasión y control de los impulsos primarios a través de la suavidad.", "reversed": "Debilidad, abuso de poder, tiranía de los instintos o inseguridad."},
    "9": {"nombre": "El Ermitaño", "arquetipo": "La Introspección", "upright": "Búsqueda de la verdad interior, soledad voluntaria, sabiduría del tiempo y prudencia.", "reversed": "Aislamiento destructivo, rechazo a la ayuda, obsesión con el pasado o imprudencia."},
    "10": {"nombre": "La Rueda de la Fortuna", "arquetipo": "El Cambio Inevitable", "upright": "Ciclos, giros del destino, golpes de suerte, evolución necesaria del entorno.", "reversed": "Resistencia al cambio, mala racha temporal, repetición de patrones del pasado."},
    "11": {"nombre": "La Justicia", "arquetipo": "La Causa y Efecto", "upright": "Verdad, equidad, consecuencias legales o morales equilibradas. Honestidad radical.", "reversed": "Injusticia, sesgo, falta de rendición de cuentas, desequilibrio o juicios severos."},
    "12": {"nombre": "El Colgado", "arquetipo": "La Rendición", "upright": "Nueva perspectiva, pausa voluntaria, sacrificio constructivo, ver las cosas al revés.", "reversed": "Martirio inútil, estancamiento por miedo, resistencia a soltar el control o apatía."},
    "13": {"nombre": "La Muerte", "arquetipo": "La Transformación", "upright": "Cierre inevitable de un ciclo, renovación profunda, final necesario para que nazca lo nuevo.", "reversed": "Resistencia dolorosa a dejar ir, estancamiento en un pasado que ya no tiene vida."},
    "14": {"nombre": "La Templanza", "arquetipo": "La Alquimia Interna", "upright": "Equilibrio, moderación, paciencia, mezcla armónica de opuestos y sanación emocional.", "reversed": "Desequilibrio, excesos, falta de paciencia, intereses en conflicto o desconexión."},
    "15": {"nombre": "El Diablo", "arquetipo": "La Sombra", "upright": "Obsesiones, ataduras materiales, magnetismo sexual intenso, confrontación con dependencias.", "reversed": "Liberación dolorosa de vicios y cadenas, o sumisión total a ilusiones destructivas."},
    "16": {"nombre": "La Torre", "arquetipo": "Ruptura del Ego", "upright": "Colapso abrupto de planes o ilusiones falsas. Un golpe inesperado que limpia el terreno.", "reversed": "Evitar un colapso inminente temporalmente, vivir atrapado en una estructura agrietada."},
    "17": {"nombre": "La Estrella", "arquetipo": "La Esperanza Divina", "upright": "Fe en el futuro, renovación espiritual, serenidad, inspiración y sanación profunda.", "reversed": "Falta de fe, desilusión, pesimismo, bloqueos creativos o falsas expectativas."},
    "18": {"nombre": "La Luna", "arquetipo": "El Subconsciente", "upright": "Ilusiones, miedos ocultos, sueños vívidos, intuición y verdades escondidas en la sombra.", "reversed": "Liberación del miedo, confusión que se aclara, secretos revelados o autoengaño expuesto."},
    "19": {"nombre": "El Sol", "arquetipo": "La Claridad Total", "upright": "Éxito rotundo, vitalidad, alegría pura, verdad revelada a la luz y conexión auténtica.", "reversed": "Felicidad nublada temporalmente, orgullo excesivo, necesidad de validación o retrasos mínimos."},
    "20": {"nombre": "El Juicio", "arquetipo": "El Despertar", "upright": "Llamado interno, absolución del pasado, decisiones definitivas que transforman la vida.", "reversed": "Dudas sobre el propio camino, autoreproche, ignorar la intuición o miedo a renovarse."},
    "21": {"nombre": "El Mundo", "arquetipo": "La Realización", "upright": "Logro absoluto, cierre exitoso de un gran viaje, integración perfecta y plenitud.", "reversed": "Falta de cierre, proyectos inacabados, metas frustradas en el último paso o estancamiento."}
}

# =====================================================================
# 3. EL PROMPT MAESTRO INTELIGENTE UNIFICADO
# =====================================================================
PROMPT_MAESTRO_BASE = """Actúa como un Consultor de Tarot Profesional de élite. Debes adoptar estrictamente el enfoque solicitado:

- Si el enfoque es 'PSICOLOGÍA', actúa como un Psicólogo Junguiano basado en arquetipos. Sé radicalmente HONESTO, REALISTA y DIRECTO. Tienes prohibido complacer. Analiza el bloqueo subconsciente.
- Si el enfoque es 'MÍSTICO', actúa como un Lector de Tarot Tradicional y místico. Analiza la tendencia de los acontecimientos, los hechos reales cotidianos y el augurio de los símbolos visuales.

Pregunta del usuario: "{pregunta_usuario}"
Enfoque solicitado: {enfoque_solicitado}
Estructura de la tirada seleccionada: {nombre_tirada}

Cartas extraídas y sus posiciones específicas:
{datos_de_las_cartas_extraidas}

Estructura tu respuesta exactamente con este formato de títulos en Markdown:

### 🧭 Veredicto e Inclinación del Oráculo
> [REGLA CRÍTICA: Escribe aquí una sola frase de MÁXIMO 15 PALABRAS. Debe ser tu veredicto fulminante, tajante y directo sobre la duda del usuario, sin rodeos].

---

### 👁️ El Análisis Detallado del Oráculo
[Desarrolla aquí el trasfondo completo de la lectura en tres párrafos limpios, conectando el significado de cada carta con su posición].

### ✨ El Consejo y Guía Final
[Ofrece la recomendación práctica o decreto místico definitivo para el consultante]."""

# =====================================================================
# 4. ELEMENTOS VISUALES Y ADVERTENCIAS (INTERFAZ COMPLETA Y PROTEGIDA)
# =====================================================================
st.title("🔮 Oráculo de la Psique")

# Firma de marca Noruf_Labs
st.markdown("""
    <div style='text-align: center; margin-top: -15px; margin-bottom: 20px;'>
        <span style='color: #D4AF37; font-weight: bold; font-family: monospace; font-size: 1.1rem;'>🔬 Noruf_Labs</span>
        <span style='color: #8a8ba0; margin: 0 10px;'>|</span>
        <span style='color: #e0e0e6; font-size: 0.9rem;'><b>Autor:</b> Norberto Urrea Falla</span>
    </div>
""", unsafe_allow_html=True)

st.caption("Un software intuitivo con respuestas claras e inmediatas")

# 🛡️ ADVERTENCIAS DE RESPONSABILIDAD RESTAURADAS
st.error("⚠️ ADVERTENCIA DE HONESTIDAD: El tarot no es una ciencia demostrada. Considéralo un entretenimiento introspectivo.")
st.info("📘 RIGOR TEÓRICO COMPARTIDO: Elige si deseas un análisis de psicología arquetípica (Jung) o un pronóstico místico clásico (Marsella).")

# Formulario ordenado
pregunta = st.text_input("1. Formula tu consulta con honestidad (el espejo no miente):", placeholder="Ej. ¿Es buen momento para tomar una decisión importante?")

enfoque_oraculo = st.selectbox("2. Elige el Alma del Tarotista:", [
    "🧠 Psicología Junguiana (Espejo Interno y Bloqueos)", 
    "✨ Tradición Mística (Pronóstico, Símbolos y Destino)"
])

# Diccionario unificado para los desplegables
MECANISMO_TIRADAS = {
    "Respuesta Rápida (1 Carta)": {
        "num": 1, 
        "nombres": ["Eje Central"]
    },
    "Línea de Tiempo (3 Cartas: Pasado - Presente - Futuro)": {
        "num": 3, 
