import { EventEmitter as NodeEventEmitter } from 'events';

class EventEmitter extends NodeEventEmitter {
    // Aquí puedes agregar métodos adicionales o lógica específica si es necesario

    emitEvent(eventName: string, ...args: any[]) {
        this.emit(eventName, ...args);
    }

    // Otros métodos útiles específicos para tu aplicación
}

export default new EventEmitter();
