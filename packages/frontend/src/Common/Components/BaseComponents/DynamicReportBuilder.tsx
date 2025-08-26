import React, { useState } from 'react';
import {DndContext,closestCenter,PointerSensor,useSensor,useSensors,DragOverlay,} from '@dnd-kit/core';
import {SortableContext,verticalListSortingStrategy,useSortable,} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChartDisplay, ChartData } from './Graph';

const availableFields = ['label', 'value', 'date'];

interface ZoneState {
  xAxis: string | null;
  yAxis: string | null;
  filters: string[];
}

const DraggableField = ({ id }: { id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 10,
    background: '#e0f2fe',
    marginBottom: 5,
    borderRadius: 5,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
};

export const DynamicReportBuilder: React.FC = () => {
  const [fields, setFields] = useState(availableFields);
  const [zones, setZones] = useState<ZoneState>({ xAxis: null, yAxis: null, filters: [] });
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const dragged = active.id;
    const target = over.id;

    if (target === 'x-axis') {
      setZones({ ...zones, xAxis: dragged });
    } else if (target === 'y-axis') {
      setZones({ ...zones, yAxis: dragged });
    } else if (target === 'filters') {
      if (!zones.filters.includes(dragged)) {
        setZones({ ...zones, filters: [...zones.filters, dragged] });
      }
    }

    setFields(fields.filter(f => f !== dragged));
  };

  const sampleData: ChartData[] = [
    { label: 'A', value: 120, date: '2025-01-01' },
    { label: 'B', value: 90, date: '2025-02-01' },
    { label: 'C', value: 60, date: '2025-03-01' },
  ];

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">🎛️ Dynamic Report Builder</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-8">
          {/* Campos disponibles */}
          <div className="p-3 border w-40 bg-white rounded">
            <h3 className="font-bold mb-2">Campos</h3>
            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
              {fields.map((field) => (
                <DraggableField key={field} id={field} />
              ))}
            </SortableContext>
          </div>

          {/* Zonas de destino */}
          <div className="flex flex-col gap-4">
            {['x-axis', 'y-axis', 'filters'].map((zoneId) => (
              <div key={zoneId} id={zoneId} className="p-3 border w-60 bg-white rounded min-h-[80px]">
                <h4 className="font-bold mb-2">
                  {zoneId === 'x-axis'
                    ? '🧭 Eje X'
                    : zoneId === 'y-axis'
                    ? '📊 Eje Y'
                    : '🔍 Filtros'}
                </h4>
                <div>
                  {zoneId === 'x-axis' && zones.xAxis && (
                    <div className="bg-green-100 p-2 rounded">{zones.xAxis}</div>
                  )}
                  {zoneId === 'y-axis' && zones.yAxis && (
                    <div className="bg-green-100 p-2 rounded">{zones.yAxis}</div>
                  )}
                  {zoneId === 'filters' &&
                    zones.filters.map((f, i) => (
                      <div key={i} className="bg-yellow-100 p-2 rounded mb-1">
                        {f}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="bg-blue-300 text-white px-4 py-2 rounded shadow">
              {activeId}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Vista previa del gráfico */}
      <div className="mt-8">
        {zones.xAxis && zones.yAxis ? (
          <>
            <h3 className="font-bold mb-2">Vista previa:</h3>
            <ChartDisplay
              type="bar"
              data={sampleData}
              rtl={true}
              onClickLabel={(label) => alert(`Click en ${label}`)}
            />
          </>
        ) : (
          <p className="text-sm text-gray-500">🛠️ Arrastra campos a los ejes para ver la gráfica.</p>
        )}
      </div>
    </div>
  );
};
