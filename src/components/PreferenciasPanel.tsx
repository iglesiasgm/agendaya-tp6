import React, { useState, useEffect, useRef } from "react";

export type CalendarView = "Mes" | "Semana" | "Día";

export interface PreferenciasPanelProps {
  onSavePreferences?: (prefs: {
    view: CalendarView;
    darkMode: boolean;
  }) => Promise<void>;
  simulateLatencyMs?: number; // Para pruebas de latencia y timeouts
}

export const PreferenciasPanel: React.FC<PreferenciasPanelProps> = ({
  onSavePreferences,
  simulateLatencyMs = 0,
}) => {
  // --- M05-CP05: Preferencias persistentes ---
  const [selectedView, setSelectedView] = useState<CalendarView>(() => {
    return (
      (localStorage.getItem("agenda_default_view") as CalendarView) || "Mes"
    );
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("agenda_dark_mode") === "true";
  });

  // --- M05-CP06: Estados de latencia y timeouts ---
  const [isNavigating, setIsNavigating] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinnerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // M05-CP05: Guardado en localStorage ante cambios
  const handleViewChange = (newView: CalendarView) => {
    // Escenario 2 de CP06: Navegación de interfaz con control de 200ms
    setIsNavigating(true);
    spinnerTimerRef.current = setTimeout(() => {
      setShowSpinner(true);
    }, 200);

    setTimeout(
      () => {
        setSelectedView(newView);
        localStorage.setItem("agenda_default_view", newView);
        if (spinnerTimerRef.current) clearTimeout(spinnerTimerRef.current);
        setShowSpinner(false);
        setIsNavigating(false);
      },
      simulateLatencyMs > 0 ? simulateLatencyMs : 50,
    );
  };

  const handleDarkModeToggle = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem("agenda_dark_mode", String(nextMode));
    if (nextMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // M05-CP06: Transacción R/W con umbrales de 2.5s y 5.0s
  const handleSaveTransaction = async () => {
    setIsProcessing(true);
    setWarningMessage(null);
    setStatusMessage(null);

    const payload = { view: selectedView, darkMode };

    // Umbral 1: Advertencia tras 2.5 segundos (2500ms)
    warnTimerRef.current = setTimeout(() => {
      setWarningMessage(
        "Lo sentimos, la operación está tomando más de lo esperado",
      );
    }, 2500);

    // Umbral 2: Cancelación y respaldo en sessionStorage a los 5 segundos (5000ms)
    const timeoutPromise = new Promise((_, reject) => {
      abortTimerRef.current = setTimeout(() => {
        sessionStorage.setItem(
          "pending_transaction_backup",
          JSON.stringify(payload),
        );
        reject(new Error("TIMEOUT_EXCEEDED"));
      }, 5000);
    });

    try {
      const executionPromise = onSavePreferences
        ? onSavePreferences(payload)
        : new Promise((resolve) => setTimeout(resolve, simulateLatencyMs));

      await Promise.race([executionPromise, timeoutPromise]);

      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
      if (abortTimerRef.current) clearTimeout(abortTimerRef.current);
      setStatusMessage("Preferencias actualizadas con éxito");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.message === "TIMEOUT_EXCEEDED") {
        setStatusMessage(
          "Operación cancelada por timeout. Datos respaldados en sesión.",
        );
      } else {
        setStatusMessage("Error al ejecutar la transacción");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
      if (abortTimerRef.current) clearTimeout(abortTimerRef.current);
      if (spinnerTimerRef.current) clearTimeout(spinnerTimerRef.current);
    };
  }, []);

  return (
    <div
      data-testid="preferencias-panel"
      className={`p-6 rounded-lg shadow-md border ${
        darkMode
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-200"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Preferencias de Interfaz</h2>

      {/* Escenario 2 (CP06): Spinner de carga si el cambio tarda más de 200ms */}
      {showSpinner && (
        <div
          role="status"
          aria-label="loading-spinner"
          className="mb-4 text-blue-500 font-semibold"
        >
          Cargando vista...
        </div>
      )}

      {/* Selector de Vistas de Calendario (CP05) */}
      <div className="mb-4">
        <label htmlFor="view-select" className="block text-sm font-medium mb-1">
          Vista predeterminada del calendario:
        </label>
        <select
          id="view-select"
          data-testid="view-select"
          value={selectedView}
          onChange={(e) => handleViewChange(e.target.value as CalendarView)}
          className="border rounded px-3 py-2 text-black"
          disabled={isNavigating || isProcessing}
        >
          <option value="Mes">Mes</option>
          <option value="Semana">Semana</option>
          <option value="Día">Día</option>
        </select>
      </div>

      {/* Toggle de Modo Oscuro (CP05) */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="dark-mode-toggle" className="text-sm font-medium">
          Modo oscuro:
        </label>
        <input
          id="dark-mode-toggle"
          data-testid="dark-mode-toggle"
          type="checkbox"
          checked={darkMode}
          onChange={handleDarkModeToggle}
          className="h-4 w-4"
          disabled={isProcessing}
        />
      </div>

      {/* Botón de Transacción R/W (CP06) */}
      <button
        data-testid="btn-save-transaction"
        onClick={handleSaveTransaction}
        disabled={isProcessing}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition disabled:opacity-50"
      >
        {isProcessing ? "Procesando transacción..." : "Guardar en Servidor"}
      </button>

      {/* Mensajes de advertencia y estado (CP06) */}
      {warningMessage && (
        <div
          data-testid="warning-msg"
          className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded"
        >
          {warningMessage}
        </div>
      )}

      {statusMessage && (
        <div
          data-testid="status-msg"
          className="mt-2 text-sm font-medium text-gray-500"
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default PreferenciasPanel;
