import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from "../service/app.layout.service";
import { MenuService } from "../service/app.menu.service";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html',
  styleUrls: ['./app.config.component.scss'],
  providers: [MessageService]
})
export class AppConfigComponent implements OnInit, OnDestroy {

  @Input() minimal: boolean = false;

  scales: number[] = [12, 13, 14, 15, 16];
  iframeVisible = true;
  splittedRoles: string[] = [];
  perimetre: string | null = null;
  firstName: string | null = null;

  isOperator: boolean = false;
  displayPopup: boolean = false;
  connected: boolean = false;

  constructor(
    public layoutService: LayoutService,
    public menuService: MenuService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    window.addEventListener('message', this.eventlisten.bind(this));
    window.removeEventListener('message', this.eventlisten.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.eventlisten.bind(this));
  }

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
    return this.layoutService.config.scale;
  }

  set scale(_val: number) {
    this.layoutService.config.scale = _val;
  }

  get menuMode(): string {
    return this.layoutService.config.menuMode;
  }

  set menuMode(_val: string) {
    this.layoutService.config.menuMode = _val;
  }

  get inputStyle(): string {
    return this.layoutService.config.inputStyle;
  }

  set inputStyle(_val: string) {
    this.layoutService.config.inputStyle = _val;
  }

  get ripple(): boolean {
    return this.layoutService.config.ripple;
  }

  set ripple(_val: boolean) {
    this.layoutService.config.ripple = _val;
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  changeTheme(theme: string, colorScheme: string) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
    this.replaceThemeLink(newHref, () => {
      this.layoutService.config.theme = theme;
      this.layoutService.config.colorScheme = colorScheme;
      this.layoutService.onConfigUpdate();
    });
  }

  replaceThemeLink(href: string, onComplete: Function) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }

  eventlisten(event: MessageEvent) {
    const data = event.data;
    console.info(data);

    if (data.event === 'inboundCall') {
      this.iframeVisible = true;
      console.log('hello');
      console.log('Inbound Call Details:', {
        value: JSON.stringify(data.data.variables),
        output1: data.data.contactNumber,
        output2: data.data.serviceName,
        output3: data.data.variables.contact,
        output4: data.data.variables.idticket
      });
    } else if (data.event === 'agentStatusChanged') {
      if ((data.data.currentStatus === 'Disponible' && data.data.previousStatus === 'En traitement') || (data.data.currentStatus === 'Available' && data.data.previousStatus === 'Working')) {
        if(this.connected == true){
          this.messageService.add({severity:'info', summary:'Appel terminé', detail:'L\'appel a été terminé par le client'});
        }
      }
      else if ((data.data.currentStatus === 'Disponible' && data.data.previousStatus === 'Absent') && (data.data.currentStatus === 'Available' && data.data.previousStatus === 'Away')) {
        if(this.connected == true){
          this.messageService.add({severity:'info', summary:'Appel terminé', detail:'L\'appel a été terminé par le client'});
        }
      }
      else if (data.data.currentStatus === 'En traitement' || data.data.currentStatus === 'Working') {
        this.messageService.add({severity:'warn', summary:'Appel en cours', detail:'Un appel est en cours'});
        // console.log(this.connected)

      }
      else if (data.data.currentStatus === 'Logout') {
        this.messageService.add({severity:'warn', summary:'Déconnexion', detail:'Vous avez bien été déconnecté'});
        this.setConnected(false);
        // console.log(this.connected)

      }
      else if (data.data.currentStatus === 'Login') {
        this.messageService.add({severity:'info', summary:'Connexion', detail:'Vous avez bien été connecté'});
        this.setConnected(true);
        // console.log(this.connected)

      }
    }
    else if(data.event === 'agentLogin'){
      this.messageService.add({severity:'info', summary:'Connexion', detail:'Vous avez bien été connecté'});
      this.setConnected(true);
      // console.log(this.connected)
    }
  }

  onGlobalButtonClick() {
    // Logique lorsque le bouton global est cliqué
    // console.log('Bouton global cliqué');
    // Vous pouvez ouvrir un sidebar, modal ou toute autre action
  }

  toggleIframe(): void {
    this.iframeVisible = !this.iframeVisible;
  }

  bubble_fn_Diabolo_event(data?: any) {
    // Implémentez la logique de votre fonction ici
    console.log('bubble_fn_Diabolo_event', data);
  }

  // Méthodes pour mettre à jour la variable connected
  setConnected(value: boolean) {
    this.connected = value;
  }
}
