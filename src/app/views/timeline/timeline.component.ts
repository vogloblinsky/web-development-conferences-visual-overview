import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, UrlTree, UrlSegmentGroup, UrlSegment } from '@angular/router';

import * as vis from 'vis';

import { ConferencesService } from '../../common/services/conferences.service';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TimelineComponent implements AfterViewInit {

    conferences: any[];
    conference;

    constructor(private conferencesService: ConferencesService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.conferences = this.conferencesService.getConferencesForTimeline();
    }

    getConference(id) {
        return this.conferences.filter(conference => conference.id === id)[0];
    }

    ngAfterViewInit() {
        const container = document.getElementById('visualization'),

            items = new vis.DataSet(this.conferences),
            groups = new vis.DataSet(this.conferencesService.getRegionsForTimeline()),

            options: any = {
                min: '2017-01-01',
                max: '2018-12-31',
                selectable: true,
                groupOrder: 'content',
                editable: false
            },

            timeline = new vis.Timeline(container, items, options);
        timeline.setGroups(groups);

        timeline.on('click', (properties) => {
            let selectedConference = this.getConference(properties.item);
            this.router.navigate(['/', {outlets: {'detail': [selectedConference.idApp]}}]);
        });

        //Focus to opened conference
        const tree: UrlTree = this.router.parseUrl(this.router.url);
        const detailSegmentGroup: UrlSegmentGroup = tree.root.children['detail'];
        if (detailSegmentGroup) {
            const detailSegment: UrlSegment = detailSegmentGroup.segments[0];
            this.conference = this.conferencesService.getConference(detailSegment.path);
            console.log(this.conference);
            //timeline.setSelection([this.conference.id]); TODO set with timeline id and not data one
        }
    }
}
