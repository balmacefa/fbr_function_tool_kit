export abstract class OmMonoBehaviour {
    public components: OmMonoComponent[] = [];

    constructor() {
        this.OnAwake();
    }

    addComponent(component: OmMonoComponent): void {
        this.components.push(component);
        component.OnAwake?.(this);
    }

    OnStart(): void {
        this.components.forEach(component => component.OnStart?.());
    }

    OnUpdate(): void {
        this.components.forEach(component => component.OnUpdate?.(this));
    }

    OnAwake(): void {
        this.components.forEach(component => component.OnAwake?.(this));
    }
    OnFixedUpdate(): void {
        this.components.forEach(component => component.OnFixedUpdate?.(this));
    }

    OnLateUpdate(): void {
        this.components.forEach(component => component.OnLateUpdate?.(this));
    }

    OnEnable(): void {
        this.components.forEach(component => component.OnEnable?.(this));
    }

    OnDisable(): void {
        this.components.forEach(component => component.OnDisable?.(this));
    }

    OnDestroy(): void {
        this.components.forEach(component => component.OnDestroy?.(this));
    }

    abstract OnRegisterEvent(): { key: string; func_call_back: any };
    abstract OnPublishEvent(): { key: string; };
}

interface OmMonoComponent {
    OnHtml?(): string;
    OnStart?(): void;
    OnUpdate?(OmMonoInstance: OmMonoBehaviour): void;
    OnAwake?(OmMonoInstance: OmMonoBehaviour): void;
    OnFixedUpdate?(OmMonoInstance: OmMonoBehaviour): void;
    OnLateUpdate?(OmMonoInstance: OmMonoBehaviour): void;
    OnEnable?(OmMonoInstance: OmMonoBehaviour): void;
    OnDisable?(OmMonoInstance: OmMonoBehaviour): void;
    OnDestroy?(OmMonoInstance: OmMonoBehaviour): void;
}
