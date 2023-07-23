import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';

//libreria de ArcGIS
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D.js';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle.js';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion.js';
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D.js';
import Expand from '@arcgis/core/widgets/Expand.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Fullscreen from '@arcgis/core/widgets/Fullscreen.js';
import Home from '@arcgis/core/widgets/Home.js';
import LayerList from '@arcgis/core/widgets/LayerList.js';
import Legend from '@arcgis/core/widgets/Legend.js';
import Locate from '@arcgis/core/widgets/Locate.js';
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import PopupTemplate from '@arcgis/core/PopupTemplate.js';
import Print from '@arcgis/core/widgets/Print.js';
import ScaleBar from '@arcgis/core/widgets/ScaleBar.js';
import Search from '@arcgis/core/widgets/Search.js';
import Zoom from '@arcgis/core/widgets/Zoom.js';
interface LayerConfig {
	title: string;
	url: string;
	popupTemplate?: PopupTemplate;
	visible: boolean;
	outFields?: string[];
}

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
	public toogle: boolean = false;
	public lis: any[] = [];
	public view: any = null;
	public mapa = new Map({
		basemap: 'hybrid',
	});
	controlCapas: any = null;
	searchTerm: string = '';
	filteredArray: any[] = [];
	private popuTemplateCapitalDistrito = new PopupTemplate({
		title: '{nombre_departamento} - {nombre_provincia} - {nombre_distrito}',
		content: [
			{
				type: 'fields',
				fieldInfos: [
					{
						fieldName: 'codigo_centropoblado',
						label: '<b><font>CODIGO DE CENTRO URBANO</font></b>',
						visible: true,
						stringFieldOption: 'text-box',
					},
					{
						fieldName: 'nombre_centropoblado',
						label: '<b><font>NOMBRE DE CENTRO URBANO</font></b>',
						visible: true,
						stringFieldOption: 'text-box',
					},
					{
						fieldName: 'poblacion_total',
						label: '<b><font>POBLACION TOTAL</font></b>',
						visible: true,
						stringFieldOption: 'text-box',
					},
					{
						fieldName: 'poblacion_hombres',
						label: '<b><font>POBLACION DE HOMBRES</font></b>',
						visible: true,
						stringFieldOption: 'text-box',
					},
					{
						fieldName: 'poblacion_mujeres',
						label: '<b><font>POBLACION DE MUJERES</font></b>',
						visible: true,
						stringFieldOption: 'text-box',
					},
					{
						fieldName: 'viviendas_totales',
						label: '<b><font>CANTIDAD DE VIVIENDAS</font></b>',
						visible: true,
						stringFieldOption: 'text-box',
					},
					{
						fieldName: 'area_centropoblado',
						label: '<b><font>AREA (Has)</font></b>',
						format: {
							digitSeparator: true, // Uses a comma separator in numbers >999
							places: 2, // Sets the number of decimal places to 0 and rounds up
						},
					},
					{
						fieldName: 'longitud ',
						label: '<b><font>LONGITUD</font></b>',
						format: {
							digitSeparator: true, // Uses a comma separator in numbers >999
							places: 5, // Sets the number of decimal places to 0 and rounds up
						},
					},
					{
						fieldName: 'latitud ',
						label: '<b><font>LATITUD</font></b>',
						format: {
							digitSeparator: true, // Uses a comma separator in numbers >999
							places: 5, // Sets the number of decimal places to 0 and rounds up
						},
					},
				],
			},
		],
	});
	private limdepartamento = 'https://dportalgis.vivienda.gob.pe/dhtserver/rest/services/PNC/MapaGeoCIUDAD/MapServer/3';
	private limprovincia = 'https://dportalgis.vivienda.gob.pe/dhtserver/rest/services/PNC/MapaGeoCIUDAD/MapServer/2';
	private limdistrito = 'https://dportalgis.vivienda.gob.pe/dhtserver/rest/services/PNC/MapaGeoCIUDAD/MapServer/1';
	private capitalDistrito = 'https://dportalgis.vivienda.gob.pe/dhtserver/rest/services/PNC/MapaGeoCIUDAD/MapServer/8';

	public layers: LayerConfig[] = [
		{
			title: 'Limite de departamentos',
			url: this.limdepartamento,
			popupTemplate: undefined,
			visible: true,
		},
		{
			title: 'Limite de provincias',
			url: this.limprovincia,
			popupTemplate: undefined,
			visible: true,
		},
		{
			title: 'Limite de distritos',
			url: this.limdistrito,
			popupTemplate: undefined,
			visible: true,
		},
		{
			title: 'Centro Urbano',
			url: this.capitalDistrito,
			popupTemplate: this.popuTemplateCapitalDistrito,
			outFields: ['nombre_centropoblado', 'ubigeo_distrito'],
			visible: true,
		},
	];
	@ViewChild('mapViewNode', {static: true}) private mapViewEl!: ElementRef;
	initializeMap(): Promise<any> {
		const container = this.mapViewEl.nativeElement;

		this.layers.forEach((layerConfig) => {
			let featureLayer;
			if (layerConfig.popupTemplate == undefined) {
				featureLayer = new FeatureLayer({
					url: layerConfig.url,
					title: layerConfig.title,
					visible: layerConfig.visible,
				});
			} else {
				featureLayer = new FeatureLayer({
					url: layerConfig.url,
					title: layerConfig.title,
					popupTemplate: layerConfig.popupTemplate,
					outFields: layerConfig.outFields,
					visible: layerConfig.visible,
				});
			}

			this.mapa.add(featureLayer);
		});

		// //Carga de la capa limite de departamento
		// this.limitDepartamentos = new FeatureLayer({
		// 	url: limdepartamento,
		// 	title: 'Limite de departamentos',
		// 	visible: this.showLimitDepartamentos,
		// });
		// console.log('limitDepartamentos =>', this.limitDepartamentos);
		// mapa.add(this.limitDepartamentos);
		// //Carga de la capa limite de provincia
		// this.limitProvincias = new FeatureLayer({
		// 	url: limprovincia,
		// 	title: 'Limite de departamentos',
		// 	visible: this.showLimitProvincias,
		// });
		// console.log('limitProvincias =>', this.limitProvincias.visible);
		// mapa.add(this.limitProvincias);
		// //Carga de la capa limite de distrito
		// this.limitDistritos = new FeatureLayer({
		// 	url: limdistrito,
		// 	title: 'Limite de departamentos',
		// 	visible: this.showLimitDistritos,
		// });
		// mapa.add(this.limitDistritos);
		// //popupTemplate de Capital de distrito

		// //Carga de capa de Capital de distrito
		// this.zonasCentroCapitalDistrito = new FeatureLayer({
		// 	url: capitalDistrito,
		// 	title: 'Centro Urbano',
		// 	popupTemplate: this.popuTemplateCapitalDistrito,
		// 	outFields: ['nombre_centropoblado', 'ubigeo_distrito'],
		// 	visible: this.showZonasCentroCapitalDistrito,
		// });
		// mapa.add(this.zonasCentroCapitalDistrito);

		const listNode = document.getElementById('nyc_graphics');
		console.log(listNode);
		//Declarar la vista del Mapa
		const view = new MapView({
			container: container,
			map: this.mapa,
			center: [-75.015152, -9.189967], //longitud, latitud (Centro del mapa) -12.0458293,-77.0285855
			zoom: 6,
			rotation: 0,
			constraints: {
				snapToZoom: false,
			},
			padding: {top: 0},
			ui: {
				components: [],
			}, //Altura del mapa
		});

		//Estructura de arreglo para realizar busquedas
		const arregloCapasBusqueda = [
			{
				layer: new FeatureLayer({
					url: this.capitalDistrito,
					outFields: ['*'],
				}),
				searchFields: ['nombre_centropoblado'],
				displayField: 'nombre_centropoblado',
				exactMatch: false,
				outFields: ['*'],
				name: 'CENTRO POBLADO',
				placeholder: 'Ejemplo: LIMA',
				maxResults: 6,
				maxSuggestions: 6,
				suggestionsEnabled: true,
				minSuggestCharacters: 0,
				PopupTemplate: this.popuTemplateCapitalDistrito,
			},
			{
				layer: new FeatureLayer({
					url: this.limdistrito,
					outFields: ['*'],
				}),
				searchFields: ['nom_distrito'],
				displayField: 'nom_distrito',
				exactMatch: false,
				outFields: ['*'],
				name: 'NOMBRE DISTRITO',
				placeholder: 'Ejemplo: LIMA',
				maxResults: 6,
				maxSuggestions: 6,
				suggestionsEnabled: true,
				minSuggestCharacters: 0,
				//PopupTemplate: popuTemplateCapitalDistrito,
			},
		];
		const buscaCapas = new Search({
			view: view,
			sources: arregloCapasBusqueda,
			suggestionsEnabled: false,
			allPlaceholder: 'Busquedas',
		});
		const buscarCapaExpand = new Expand({
			expandIconClass: 'esri-icon-search',
			view: view,
			expandTooltip: 'BUSQUEDAS',
			content: buscaCapas,
		});
		view.ui.add(buscarCapaExpand, {position: 'top-right', index: 2});
		//Boton de acercar y alejar (1)
		const zoom = new Zoom({
			view: view,
		});
		view.ui.add(zoom, 'top-right');
		//Boton de Inicio de mapa (2)
		const homeBtn = new Home({
			view: view,
		});
		view.ui.add(homeBtn, 'top-right');
		//Boton de Pantalla completa (3)
		const fullscreen = new Fullscreen({
			view: view,
		});
		view.ui.add(fullscreen, 'top-right');
		//Funcion de Galeria de mapas (4)
		const basemapGallery = new BasemapGallery({
			view: view,
		});
		const GaleryExpand = new Expand({
			expandIconClass: 'esri-icon-basemap',
			view: view,
			expandTooltip: 'GALERIA DE MAPAS',
			content: basemapGallery,
		});
		view.ui.add(GaleryExpand, {position: 'top-right'});
		//Leyenda del mapa
		const leyenda = new Legend({
			view: view,
			icon: 'legend-plus',
		});
		const leyendaExpand = new Expand({
			expandIconClass: 'esri-icon-legend',
			view: view,
			expandTooltip: 'LEYENDA',
			content: leyenda,
		});
		view.ui.add(leyendaExpand, {position: 'top-right'});
		//Funcion de impresion (5)
		const print = new Print({
			view: view,
			printServiceUrl: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
		});
		const ImpresionExpand = new Expand({
			expandIconClass: 'esri-icon-printer',
			view: view,
			expandTooltip: 'IMPRESION',
			content: print,
		});
		view.ui.add(ImpresionExpand, {position: 'top-right'});
		//Funcion de medidas (6)
		const distanciaWidget = new DistanceMeasurement2D({
			view: view,
		});
		const distanciaExpand = new Expand({
			expandIconClass: 'esri-icon-measure-line',
			view: view,
			expandTooltip: 'MEDIR DISTANCIA',
			content: distanciaWidget,
		});
		view.ui.add(distanciaExpand, {position: 'top-right'});
		const areaWidget = new AreaMeasurement2D({
			view: view,
		});
		const areaExpand = new Expand({
			expandIconClass: 'esri-icon-measure-area',
			view: view,
			expandTooltip: 'MEDIR DISTANCIA',
			content: areaWidget,
		});
		view.ui.add(areaExpand, {position: 'top-right'});
		//Funcion de localizar
		const locateBtn = new Locate({
			view: view,
		});
		view.ui.add(locateBtn, {position: 'top-trailing'});
		//Funcion de escala
		const scaleBarra = new ScaleBar({
			view: view,
			unit: 'dual',
		});
		view.ui.add(scaleBarra, {position: 'bottom-left'});
		//Funcion de coordenadas
		const ccoordenadas = new CoordinateConversion({
			view: view,
		});
		const ccordenadasExpand = new Expand({
			expandIconClass: 'esri-icon-radio-checked',
			view: view,
			expandTooltip: 'COORDENADAS',
			content: ccoordenadas,
		});
		view.ui.add(ccordenadasExpand, {position: 'top-right'});
		const toggle = new BasemapToggle({
			view: view, // view that provides access to the map's 'topo-vector' basemap
			nextBasemap: 'streets-navigation-vector', // allows for toggling to the 'hybrid' basemap
		});
		view.ui.add(toggle, 'bottom-right');
		//Control de capas
		// this.controlCapas = new LayerList({
		// 	view: view,
		// });
		// const controlCapasExpand = new Expand({
		// 	expandIconClass: 'esri-icon-layers',
		// 	view: view,
		// 	expandTooltip: 'COORDENADAS',
		// 	content: this.controlCapas,
		// });
		// view.ui.add(controlCapasExpand, 'top-right');

		//Procedimiento Slider de busqueda de Centro Poblado de capital de distrito
		const featureLayer = this.mapa.layers.find((layer) => layer.title === 'Centro Urbano');
		console.log('1 =>', featureLayer);
		this.view = view;
		let graphics: any;
		this.view
			.whenLayerView(featureLayer)
			.then(
				(layerView: {
					watch: (arg0: string, arg1: (value: any) => void) => void;
					queryFeatures: (arg0: {geometry: __esri.Extent; returnGeometry: boolean; orderByFields: string[]}) => Promise<{features: any}>;
				}) => {
					layerView.watch('updating', (value) => {
						if (!value) {
							// wait for the layer view to finish updating
							// query all the features available for drawing.
							layerView
								.queryFeatures({
									geometry: view.extent,
									returnGeometry: true,
									orderByFields: ['ubigeo_distrito'],
								})
								.then((results: {features: any}) => {
									graphics = results.features;
									this.lis = results.features;
									this.filteredArray = results.features;
									this.searchTerm = '';

									const fragment = document.createDocumentFragment();
									graphics.forEach(function (result: {attributes: any}, index: string) {
										const attributes = result.attributes;
										const name = attributes.nombre_centropoblado;
										// Create a list zip codes in NY
										const li = document.createElement('li');
										li.classList.add('panel-result');
										li.tabIndex = 0;
										li.setAttribute('data-result-id', index);
										li.textContent = name;
										fragment.appendChild(li);
									});
									// Empty the current list
									console.log(results.features);
									if (listNode) {
										listNode.innerHTML = '';
										listNode.appendChild(fragment);
									}
								})
								.catch(function (error: any) {
									console.error('query failed: ', error);
								});
						}
					});
				}
			);
		const onListClickHandler = (event: {target: any}) => {
			console.log(event.target);
			const target = event.target;
			console.log(' =>', target);
			const resultId = target.getAttribute('data-result-id');

			// get the graphic corresponding to the clicked zip code
			const result = resultId && graphics && graphics[parseInt(resultId, 10)];
			console.log(result);
			if (result) {
				// open the popup at the centroid of zip code polygon
				// and set the popup's features which will populate popup content and title.
				this.view
					.goTo(result.geometry.extent.expand(2))
					.then(function () {
						view.openPopup({
							features: [result],
							location: result.geometry.centroid,
						});
					})
					.catch(function (error: {name: string}) {
						if (error.name != 'AbortError') {
							console.error(error);
						}
					});
			}
		};
		listNode?.addEventListener('click', onListClickHandler);
		return this.view.when();
	}
	ngOnInit(): any {
		this.initializeMap().then(() => {
			console.log('Mapa DESARROLLADO POR ING. JORGE CHAFLOQUE.');
		});
	}
	ngOnDestroy(): void {
		if (this.view) {
			this.view.destroy();
		}
	}
	capa() {
		this.controlCapas = new LayerList({
			view: this.view,
		});
		const controlCapasExpand = new Expand({
			expandIconClass: 'esri-icon-layers',
			view: this.view,
			expandTooltip: 'COORDENADAS',
			content: this.controlCapas,
		});
		this.view.ui.add(controlCapasExpand, 'top-right');
	}
	onListClickHandler2(resultId: string) {
		// console.log('lis =>', this.view);

		// get the graphic corresponding to the clicked zip code
		const result = resultId && this.lis && this.lis[parseInt(resultId, 10)];
		console.log(result);
		if (result) {
			// open the popup at the centroid of zip code polygon
			// and set the popup's features which will populate popup content and title.
			this.view
				.goTo(result.geometry.extent.expand(2))
				.then(() => {
					this.view.openPopup({
						features: [result],
						location: result.geometry.centroid,
					});
				})
				.catch(function (error: {name: string}) {
					if (error.name != 'AbortError') {
						console.error(error);
					}
				});
		}
		// this.view.when()
	}
	toggleLayerVisibility(layerConfig: LayerConfig): void {
		layerConfig.visible = !layerConfig.visible;
		const featureLayer = this.mapa.layers.find((layer) => layer.title === layerConfig.title);
		if (featureLayer) {
			featureLayer.visible = layerConfig.visible;
		}
	}
	onSearch() {
		// Filtrar el array original en función del término de búsqueda
		this.filteredArray = this.lis.filter((item) =>
			item.attributes.nombre_centropoblado.toLowerCase().includes(this.searchTerm.toLowerCase())
		);
	}
}
