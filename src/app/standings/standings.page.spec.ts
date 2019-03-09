import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingsPage } from './standings.page';

describe('StandingsPage', () => {
    let component: StandingsPage;
    let fixture: ComponentFixture<StandingsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StandingsPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StandingsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
