import { Injectable } from '@angular/core';
import { FormComponent, ComponentPosition } from '../models/form-component.model';
import { FormSection } from '../models/form-section.model';
import { FormPage } from '../models/form-page.model';
import { UUID } from 'angular2-uuid';
import { DndEvent } from '../models/dnd.model';
import { GridStyle, GridTemplate, GridPosition } from '../models/style.model';

@Injectable()
export class DndService {

    synchroniseSectionModel(page: FormPage, event: DndEvent) {
        let sourceSection = page.sections.find(s => s.sectionId === event.sourceWrapperId);
        let sourceComponent = null;
        if (event.sourceObjectId === 'new') {
            sourceComponent = this.newComponent();
            event.sourceObjectId = sourceComponent.componentId;
            sourceSection = page.sections.find(s => s.sectionId === event.targetWrapperId);
            if (sourceSection)
                sourceSection.components.push(sourceComponent);
            else
                return page; // this should never happen
        } else
            sourceComponent = sourceSection.components.find(c => c.componentId === event.sourceObjectId);

        if (!sourceComponent)
            return;

        // has the component been moved across position type (header/body)?
        if (sourceComponent.position.type !== event.positionType)
            sourceComponent.position.type = event.positionType;

        // has the component been placed in a differnet CSS grid area?
        if (sourceComponent.position.id !== event.targetPositionId)
            sourceComponent.position.id = event.targetPositionId;

        if (event.sourceWrapperId !== event.targetWrapperId) {
            let targetSection = this.transferComponent(page, sourceSection, event);
            targetSection.template.reRender = true;
            targetSection = this.reorderComponents(targetSection, sourceComponent, event);
        } else
            sourceSection = this.reorderComponents(sourceSection, sourceComponent, event);

        sourceSection.template.reRender = true;
        return page;
    }

    synchronisePageModel(page: FormPage, event: DndEvent) {
        let sourceSection = null;

        if (event.sourceObjectId === 'new') {
            sourceSection = this.newSection();
            page.sections.push(sourceSection);
        } else
            sourceSection = page.sections.find(s => s.sectionId === event.sourceObjectId);

        // can't find the source section, model must be in different page
        if (sourceSection != null) {
            if (sourceSection.position.id !== event.targetPositionId)
                sourceSection.position.id = event.targetPositionId;

            page.template.reRender = true;

            page = this.reorderSections(page, sourceSection, event);
        }
        return page;
    }

    private reorderComponents(section: FormSection, sourceCompoment: FormComponent<any>, event: DndEvent) {
        let components = section.components.filter(c => c.position.id === sourceCompoment.position.id);

        const targetComponent = components.find(c => c.componentId === event.targetIndexId);

        if (targetComponent) {
            sourceCompoment.position.index = targetComponent.position.index;
            targetComponent.position.index = targetComponent.position.index + 0.5;
        }

        components = components.sort((left: FormComponent<any>, right: FormComponent<any>) => {
            return left.position.index - right.position.index;
        });
        for (let i = 0; i < components.length; i++) {
            components[i].position.index = i;
        }
        return section;
    }

    private reorderSections(page: FormPage, sourceSection: FormSection, event: DndEvent) {
        let sections = page.sections.filter(c => c.position.id === sourceSection.position.id);

        const targetSection = sections.find(c => c.sectionId === event.targetIndexId);

        if (targetSection) {
            sourceSection.position.index = targetSection.position.index;
            targetSection.position.index = targetSection.position.index + 0.5;
        }

        sections = sections.sort((left: FormSection, right: FormSection) => {
            return left.position.index - right.position.index;
        });
        for (let i = 0; i < sections.length; i++)
            sections[i].position.index = i;

        return page;
    }

    private transferComponent(page: FormPage, sourceSection: FormSection, event: DndEvent) {
        const targetSection = page.sections.find(s => s.sectionId === event.targetWrapperId);
        if (!targetSection)
            return null;

        const component = sourceSection.components.find(c => c.componentId === event.sourceObjectId);
        if (!component)
            return null;

        const index = sourceSection.components.findIndex(s => s.componentId === event.sourceObjectId);

        targetSection.components.push(component);
        sourceSection.components.splice(index, 1);

        return targetSection;
    }

    private newSection(): FormSection {
        return <FormSection>{
            sectionId: UUID.UUID(),
            sectionName: 'New section',
            components: [],
            template: <GridTemplate>{
                header: <GridStyle> {
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: '1fr',
                    gridTemplateAreas: '"ID1_1"'
                },
                body: <GridStyle>{
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: '1fr',
                    gridTemplateAreas: '"ID1_1"'
                }
            },
            position: <GridPosition> {
                id: '-1',
                index: 0
            }
        };
    }

    private newComponent(): FormComponent<any> {
        return <FormComponent<any>>{
            componentId: UUID.UUID(),
            label: 'New Component',
            componentName: 'FormQLLabelComponent',
            position: <ComponentPosition> {
                id: '-1',
                index: 0
            }
        };
    }
}
