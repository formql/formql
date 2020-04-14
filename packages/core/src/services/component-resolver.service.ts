import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';

@Injectable()
export class ComponentResolverService {

  public componentRegister: Record<string, any> = {};

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(componentName: string): ComponentFactory<unknown> {
    if (!this.componentRegister) {
      return null;
    }

    let comp = this.componentRegister[componentName];
    if (!comp) {
      console.log(`Component ${componentName} not found.`);
      return null;
    }
    const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(comp);
    return resolvedComponent;
  }

  public addComponents(...components: any[]) {
    if (Array.isArray(components)) {
      components.forEach( c => this.componentRegister[c.componentName] = c);
    }
  }

  public addComponent(component: any) {
    this.componentRegister[component.componentName] = component;
  }

  public getComponentArray() {
    return Array.from(Object.keys(this.componentRegister), x => this.componentRegister[x]);
  }
}


