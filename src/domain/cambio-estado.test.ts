import { describe, it, expect } from 'vitest';
import { canChangeReservationStatus, changeReservationStatus } from './cambio-estado';
import type { Reservation } from '../types/reservation';

describe('Cambio de estado', () => {
  const baseReservation: Reservation = {
    id: 'res-1',
    customerName: 'El_Potro',
    customerEmail: 'potro@email.com',
    customerPhone: '123',
    service: 'Consulta',
    date: '2026-10-15',
    startTime: '10:00',
    endTime: '11:00',
    status: 'CONFIRMED'
  };

  it('1. Permite cambiar de Confirmada a Ausente', () => {
    const result = canChangeReservationStatus(baseReservation, 'ABSENT');
    expect(result).toBe(true);
  });

  it('2. Impide elegir el mismo estado', () => {
    const result = canChangeReservationStatus(baseReservation, 'CONFIRMED');
    expect(result).toBe(false);
  });

  it('3. Impide modificar una reserva Completada', () => {
    const completedReservation: Reservation = { ...baseReservation, status: 'COMPLETED' };
    const result = canChangeReservationStatus(completedReservation, 'PENDING');
    expect(result).toBe(false);
  });

  it('4. Actualiza sólo la reserva indicada', () => {
    const res2: Reservation = { ...baseReservation, id: 'res-2', status: 'PENDING' };
    const initialList = [baseReservation, res2];
    
    const updatedList = changeReservationStatus(initialList, 'res-1', 'ABSENT');
    
    expect(updatedList[0].status).toBe('ABSENT');
    expect(updatedList[1].status).toBe('PENDING');
  });

  it('5. ID inexistente no modifica nada', () => {
    const initialList = [baseReservation];
    const updatedList = changeReservationStatus(initialList, 'id-falso', 'CANCELLED');
    
    expect(updatedList).toEqual(initialList);
  });
});