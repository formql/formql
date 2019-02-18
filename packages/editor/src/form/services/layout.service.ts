import { Injectable } from '@angular/core';

import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { setTheme } from 'ngx-bootstrap/utils';

@Injectable()
export class LayoutService {

	constructor() { }

	loadIcons(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
		setTheme('bs4');

		iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-close-24px.svg'));
		iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-add-24px.svg'));
		iconRegistry.addSvgIcon('add-circle-outline', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-add_circle_outline-24px.svg'));
		iconRegistry.addSvgIcon('crop_7_5', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-crop_7_5-24px.svg'));
		iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-edit-24px.svg'));
		iconRegistry.addSvgIcon('settings_input_hdmi', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-settings_input_hdmi-24px.svg'));
		iconRegistry.addSvgIcon('backup', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-backup-24px.svg'));
		iconRegistry.addSvgIcon('open_with', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-open_with-24px.svg'));
		iconRegistry.addSvgIcon('save', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-save-24px.svg'));
        iconRegistry.addSvgIcon('assignment', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-assignment-24px.svg'));
        iconRegistry.addSvgIcon('view_agenda', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-view_agenda-24px.svg'));
		iconRegistry.addSvgIcon('input', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-input-24px.svg'));
        iconRegistry.addSvgIcon('query_builder', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-query_builder-24px.svg'));
        iconRegistry.addSvgIcon('sd_storage', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-sd_storage-24px.svg'));
        iconRegistry.addSvgIcon('web_asset', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-web_asset-24px.svg'));
        iconRegistry.addSvgIcon('web', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-web-24px.svg'));
		iconRegistry.addSvgIcon('text_fields', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-text_fields-24px.svg'));
		iconRegistry.addSvgIcon('looks_one', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-looks_one-24px.svg'));
		iconRegistry.addSvgIcon('check_box', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-check_box-24px.svg'));
		iconRegistry.addSvgIcon('crop_landscape', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-crop_landscape-24px.svg'));
		iconRegistry.addSvgIcon('lock', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-lock-24px.svg'));
		iconRegistry.addSvgIcon('visibility_off', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-visibility_off-24px.svg'));
		iconRegistry.addSvgIcon('star_rate', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-star_rate-18px.svg'));
		iconRegistry.addSvgIcon('label', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-label-24px.svg'));
	}

}
