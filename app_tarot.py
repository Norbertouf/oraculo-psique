import streamlit as st
import secrets
from openai import OpenAI

# =====================================================================
# 1. CONFIGURACIÓN DE LA PÁGINA
# =====================================================================
st.set_page_config(
    page_title="Oráculo de la Psique - Doble Espejo",
    page_icon="🔮",
    layout="wide",
    initial_sidebar_state="expanded"
)

# BARRA LATERAL: Clave y Ajustes del Mazo

st.sidebar.markdown("---")
st.sidebar.subheader("⚙️ Ajustes del Mazo")
permitir_invertidas = st.sidebar.checkbox("Permitir cartas invertidas", value=True, help="Si se desactiva, todas las cartas saldrán obligatoriamente al derecho.")

# =====================================================================
# 2. BASE DE DATOS DE ARCANOS MAYORES
# =====================================================================
ARCANOS_MAYORES = {
    "0": {"nombre": "El Loco", "arquetipo": "El Impulso Ciego", "upright": "Nuevos caminos, saltos de fe, inicio de una aventura inesperada. Libertad absoluta.", "reversed": "Irresponsabilidad, andar a ciegas, dar pasos en falso o huir de la realidad por inmadurez."},
    "1": {"nombre": "El Mago", "arquetipo": "El Alquimista", "upright": "Capacidad para manifestar, inteligencia práctica, todas las herramientas listas para usarse.", "reversed": "Talento desperdiciado, trucos, manipulación, promesas falsas o indecisión paralizante."},
    "2": {"nombre": "La Sacerdotisa", "arquetipo": "La Inacción Sabia", "upright": "Secretos por revelar, intuición profunda, paciencia. Tiempo de maduración en silencio.", "reversed": "Intenciones ocultas que dañan, frialdad, superficialidad o ignorar la verdad que ya sabes."},
    "3": {"nombre": "La Emperatriz", "arquetipo": "La Fuerza Creativa", "upright": "Abundancia, crecimiento, fertilidad en proyectos o relaciones. Expresión artística.", "reversed": "Bloqueo, dependencia de otros, tiranía emocional o derroche de energía sin rumbo."},
    "4": {"nombre": "El Emperador", "arquetipo": "La Estructura", "upright": "Estabilidad, protección, situación con poder y límites claros. Autoridad sólida.", "reversed": "Rigidez mental extrema, tiranía, control asfixiante o caos total por falta de disciplina."},
    "13": {"nombre": "La Muerte", "arquetipo": "La Transformación", "upright": "Cierre inevitable de un ciclo, renovación profunda, final necesario para que nazca lo nuevo.", "reversed": "Resistencia dolorosa a dejar ir, estancamiento en un pasado que ya no tiene vida."},
    "15": {"nombre": "El Diablo", "arquetipo": "La Sombra", "upright": "Obsesiones, ataduras materiales, magnetismo sexual intenso, confrontación con dependencias.", "reversed": "Liberación dolorosa de vicios y cadenas, o sumisión total a ilusiones destructivas."},
    "16": {"nombre": "La Torre", "arquetipo": "Ruptura del Ego", "upright": "Colapso abrupto de planes o ilusiones falsas. Un golpe inesperado que limpia el terreno.", "reversed": "Evitar un colapso inminente temporalmente, vivir atrapado en una estructura agrietada."}
}

# =====================================================================
# 3. EL PROMPT MAESTRO INTELIGENTE UNIFICADO (FORMATO PLANO DESDE LA IA)
# =====================================================================
PROMPT_MAESTRO_BASE = """Actúa como un Consultor de Tarot Profesional. Debes adoptar estrictamente el enfoque solicitado por el usuario:

- Si el enfoque es 'PSICOLOGÍA', actúa como un Psicólogo Junguiano basado en arquetipos. Sé radicalmente HONESTO, REALISTA y DIRECTO. Tienes prohibido complacer. Analiza el bloqueo subconsciente.
- Si el enfoque es 'MÍSTICO', actúa como un Lector de Tarot Tradicional y místico. Analiza la tendencia de los acontecimientos, los hechos reales cotidianos y el augurio de los símbolos visuales.

Pregunta del usuario: "{pregunta_usuario}"
Enfoque solicitado: {enfoque_solicitado}
Cartas extraídas:
{datos_de_las_cartas_extraidas}

Estructura tu respuesta exactamente con este formato de títulos en Markdown para que se vea hermoso en la pantalla:

### 🧭 Veredicto e Inclinación del Oráculo
> [REGLA CRÍTICA: Escribe aquí una sola frase de MÁXIMO 15 PALABRAS. Debe ser tu veredicto fulminante, tajante y directo sobre la duda del usuario, sin rodeos].

---

### 👁️ El Análisis Detallado del Oráculo
[Desarrolla aquí el trasfondo completo de la lectura en tres párrafos limpios, aplicando los conceptos del enfoque seleccionado].

### ✨ El Consejo y Guía Final
[Ofrece la recomendación práctica o decreto místico final para el consultante]."""

# =====================================================================
# 4. ELEMENTOS VISUALES Y FIRMA DE AUTOR
# =====================================================================
st.title("🔮 Oráculo de la Psique")

# 🚀 TUS CRÉDITOS DE AUTOR DESTACADOS EN LA PARTE SUPERIOR
st.markdown("""
    <div style='text-align: center; margin-top: -15px; margin-bottom: 20px;'>
        <span style='color: #D4AF37; font-weight: bold; font-family: monospace; font-size: 1.1rem;'>🔬 Noruf_Labs</span>
        <span style='color: #8a8ba0; margin: 0 10px;'>|</span>
        <span style='color: #e0e0e6; font-size: 0.9rem;'><b>Autor:</b> Norberto Urrea Falla</span>
        <span style='color: #8a8ba0; margin: 0 10px;'>|</span>
        <span style='color: #8a8ba0; font-size: 0.85rem; font-style: italic;'>norbertouf@gmail.com</span>
    </div>
""", unsafe_allow_html=True)

st.caption("Un software intuitivo con respuestas claras e inmediatas")

st.error("⚠️ ADVERTENCIA DE HONESTIDAD: El tarot no es una ciencia demostrada. Considéralo un entretenimiento introspectivo.")
st.info("📘 RIGOR TEÓRICO COMPARTIDO: Elige si deseas un análisis de psicología arquetípica (Jung) o un pronóstico místico clásico (Marsella).")

pregunta = st.text_input("Formula tu consulta con honestidad (el espejo no miente):", placeholder="Ej. ¿Hablaremos ella y yo mañana por teléfono?")

enfoque_oraculo = st.selectbox("Elige el Alma del Tarotista:", [
    "🧠 Psicología Junguiana (Espejo Interno y Bloqueos)", 
    "✨ Tradición Mística (Pronóstico, Símbolos y Destino)"
])

tipo_tirada = st.selectbox("Selecciona la disposición de la lectura:", ["Espejo Directo (1 Carta)", "Evolución Cruda (3 Cartas)"])
boton_barajar = st.button("🔮 Consultar el Espejo")

# =====================================================================
# 5. LÓGICA DE BARAJADO Y DETECCIÓN DE INVERTIDAS
# =====================================================================
if boton_barajar:
    if not pregunta:
        st.warning("Por favor, introduce una consulta para activar el mecanismo de sincronía.")
    elif not api_key_input:
        st.error("Se requiere una OpenAI API Key válida en la barra lateral para generar la interpretación.")
    else:
        num_cartas = 1 if "1 Carta" in tipo_tirada else 3
        claves_disponibles = list(ARCANOS_MAYORES.keys())
        tirada_final = []
        
        for _ in range(num_cartas):
            elegida = secrets.choice(claves_disponibles)
            claves_disponibles.remove(elegida)
            
            if permitir_invertidas:
                invertida = secrets.randbelow(100) < 25
            else:
                invertida = False
                
            tirada_final.append({"datos": ARCANOS_MAYORES[elegida], "invertida": invertida})
            
        st.markdown("### Arquetipos Convocados:")
        columnas_pantalla = st.columns(num_cartas)
        posiciones_nombre = ["Origen / Bloqueo", "Realidad Presente", "Desenlace Potencial"]
        
        for idx, carta in enumerate(tirada_final):
            with columnas_pantalla[idx]:
                ori_txt = "Invertida" if carta["invertida"] else "Al Derecho"
                st.metric(label=posiciones_nombre[idx] if num_cartas == 3 else "Eje Central", value=carta["datos"]["nombre"], delta=ori_txt if permitir_invertidas else None)

        # =====================================================================
        # 6. ENTRADA Y PROCESAMIENTO DE LA RESPUESTA (ESTRUCTURA 100% PLANA)
        # =====================================================================
        texto_completo = ""
        client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])
        cartas_texto_bloque = ""
        
        for idx, c in enumerate(tirada_final):
            pos = posiciones_nombre[idx] if num_cartas == 3 else "Foco Único"
            ori = "Invertida" if c["invertida"] else "Al Derecho"
            conceptos = c["datos"]["reversed"] if c["invertida"] else c["datos"]["upright"]
            cartas_texto_bloque += f"- {pos}: {c['datos']['nombre']} ({ori}). Conceptos: {conceptos}\n"
        
        tipo_enfoque_texto = "MÍSTICO"
        if "Psicología" in enfoque_oraculo:
            tipo_enfoque_texto = "PSICOLOGÍA"
        
        prompt_definitivo = PROMPT_MAESTRO_BASE.format(
            pregunta_usuario=pregunta,
            enfoque_solicitado=tipo_enfoque_texto,
            datos_de_las_cartas_extraidas=cartas_texto_bloque
        )
        
        with st.spinner("El oráculo sintoniza con el enfoque elegido..."):
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt_definitivo}],
                max_tokens=800,
                temperature=0.7
            )
            
            lista_respuestas = getattr(response, "choices")
            primer_elemento = next(iter(lista_respuestas))
            bloque_mensaje = getattr(primer_elemento, "message")
            texto_completo = getattr(bloque_mensaje, "content")

        # Renderizado directo en la interfaz (Sin recortes, sin riesgo de fallos)
        if texto_completo:
            st.markdown("---")
            st.markdown(texto_completo)
