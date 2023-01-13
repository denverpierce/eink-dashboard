/**
 * This is a complex demo of how to set up a Highcharts chart, coupled to a
 * dynamic source and extended by drawing image sprites, wind arrow paths
 * and a second grid on top of the chart. The purpose of the demo is to inpire
 * developers to go beyond the basic chart types and show how the library can
 * be extended programmatically. This is what the demo does:
 *
 * - Loads weather forecast from www.yr.no in form of a JSON service.
 * - When the data arrives async, a Meteogram instance is created. We have
 *   created the Meteogram prototype to provide an organized structure of the
 *   different methods and subroutines associated with the demo.
 * - The parseYrData method parses the data from www.yr.no into several parallel
 *   arrays. These arrays are used directly as the data option for temperature,
 *   precipitation and air pressure.
 * - After this, the options structure is built, and the chart generated with
 *   the parsed data.
 * - On chart load, weather icons and the frames for the wind arrows are
 *   rendered using custom logic.
 */
declare function getScreenShot(): void;
declare function downloadBase64File(contentType: any, base64Data: any, fileName: any): void;
declare function Meteogram(json: any, container: any): void;
declare class Meteogram {
    constructor(json: any, container: any);
    symbols: any[];
    precipitations: any[];
    precipitationsError: any[];
    winds: any[];
    temperatures: any[];
    pressures: any[];
    json: any;
    container: any;
    /**
     * Build and return the Highcharts options structure
     */
    getChartOptions(): {
        chart: {
            renderTo: any;
            marginBottom: number;
            marginRight: number;
            marginTop: number;
            plotBorderWidth: number;
            height: number;
            width: number;
            alignTicks: boolean;
        };
        defs: {
            patterns: {
                id: string;
                path: {
                    d: string;
                    stroke: string;
                    strokeWidth: number;
                };
            }[];
        };
        title: {
            text: null;
        };
        credits: {
            text: string;
            href: string;
            position: {
                x: number;
            };
        };
        xAxis: ({
            type: string;
            tickLength: number;
            gridLineWidth: number;
            gridLineColor: string;
            startOnTick: boolean;
            endOnTick: boolean;
            minPadding: number;
            maxPadding: number;
            showLastLabel: boolean;
            labels: {
                format: string;
                align?: undefined;
                x?: undefined;
                y?: undefined;
            };
            crosshair: boolean;
            linkedTo?: undefined;
            tickInterval?: undefined;
            opposite?: undefined;
        } | {
            linkedTo: number;
            type: string;
            tickInterval: number;
            labels: {
                format: string;
                align: string;
                x: number;
                y: number;
            };
            opposite: boolean;
            tickLength: number;
            gridLineWidth: number;
            gridLineColor?: undefined;
            startOnTick?: undefined;
            endOnTick?: undefined;
            minPadding?: undefined;
            maxPadding?: undefined;
            showLastLabel?: undefined;
            crosshair?: undefined;
        })[];
        yAxis: ({
            title: {
                text: null;
            };
            labels: {
                format: string;
                style: {
                    fontSize: string;
                };
                x: number;
                enabled?: undefined;
            };
            plotLines: {
                value: number;
                color: string;
                width: number;
                zIndex: number;
            }[];
            maxPadding: number;
            gridLineColor: string;
            gridLineWidth?: undefined;
            tickLength?: undefined;
            minRange?: undefined;
            min?: undefined;
        } | {
            title: {
                text: null;
            };
            labels: {
                enabled: boolean;
                format?: undefined;
                style?: undefined;
                x?: undefined;
            };
            gridLineWidth: number;
            tickLength: number;
            minRange: number;
            min: number;
            plotLines?: undefined;
            maxPadding?: undefined;
            gridLineColor?: undefined;
        })[];
        legend: {
            enabled: boolean;
        };
        plotOptions: {
            series: {
                pointPlacement: string;
            };
            spline: {
                animation: boolean;
                lineWidth: number;
            };
        };
        series: ({
            name: string;
            data: any[];
            type: string;
            marker: {
                enabled: boolean;
                states: {
                    hover: {
                        enabled: boolean;
                    };
                };
            };
            tooltip: {
                pointFormat: string;
                valueSuffix?: undefined;
            };
            zIndex: number;
            color: string;
            negativeColor: string;
            yAxis?: undefined;
            groupPadding?: undefined;
            pointPadding?: undefined;
            grouping?: undefined;
            dataLabels?: undefined;
        } | {
            name: string;
            data: any[];
            type: string;
            color: string;
            yAxis: number;
            groupPadding: number;
            pointPadding: number;
            tooltip: {
                valueSuffix: string;
                pointFormat: string;
            };
            grouping: boolean;
            dataLabels: {
                enabled: any;
                filter: {
                    operator: string;
                    property: string;
                    value: number;
                };
                style: {
                    fontSize: string;
                    color: string;
                };
            };
            marker?: undefined;
            zIndex?: undefined;
            negativeColor?: undefined;
        } | {
            name: string;
            data: any[];
            type: string;
            color: string;
            yAxis: number;
            groupPadding: number;
            pointPadding: number;
            grouping: boolean;
            dataLabels: {
                enabled: boolean;
                filter: {
                    operator: string;
                    property: string;
                    value: number;
                };
                style: {
                    fontSize: string;
                    color: string;
                };
            };
            tooltip: {
                valueSuffix: string;
                pointFormat?: undefined;
            };
            marker?: undefined;
            zIndex?: undefined;
            negativeColor?: undefined;
        })[];
    };
    /**
     * Create the chart. This function is called async when the data file is loaded
     * and parsed.
     */
    createChart(): void;
    chart: any;
    error(): void;
    /**
     * Handle the data. This part of the code is not Highcharts specific, but deals
     * with yr.no's specific data format
     */
    parseYrData(): void;
}
declare namespace Meteogram {
    namespace dictionary {
        namespace clearsky {
            const symbol: string;
            const text: string;
        }
        namespace fair {
            const symbol_1: string;
            export { symbol_1 as symbol };
            const text_1: string;
            export { text_1 as text };
        }
        namespace partlycloudy {
            const symbol_2: string;
            export { symbol_2 as symbol };
            const text_2: string;
            export { text_2 as text };
        }
        namespace cloudy {
            const symbol_3: string;
            export { symbol_3 as symbol };
            const text_3: string;
            export { text_3 as text };
        }
        namespace lightrainshowers {
            const symbol_4: string;
            export { symbol_4 as symbol };
            const text_4: string;
            export { text_4 as text };
        }
        namespace rainshowers {
            const symbol_5: string;
            export { symbol_5 as symbol };
            const text_5: string;
            export { text_5 as text };
        }
        namespace heavyrainshowers {
            const symbol_6: string;
            export { symbol_6 as symbol };
            const text_6: string;
            export { text_6 as text };
        }
        namespace lightrainshowersandthunder {
            const symbol_7: string;
            export { symbol_7 as symbol };
            const text_7: string;
            export { text_7 as text };
        }
        namespace rainshowersandthunder {
            const symbol_8: string;
            export { symbol_8 as symbol };
            const text_8: string;
            export { text_8 as text };
        }
        namespace heavyrainshowersandthunder {
            const symbol_9: string;
            export { symbol_9 as symbol };
            const text_9: string;
            export { text_9 as text };
        }
        namespace lightsleetshowers {
            const symbol_10: string;
            export { symbol_10 as symbol };
            const text_10: string;
            export { text_10 as text };
        }
        namespace sleetshowers {
            const symbol_11: string;
            export { symbol_11 as symbol };
            const text_11: string;
            export { text_11 as text };
        }
        namespace heavysleetshowers {
            const symbol_12: string;
            export { symbol_12 as symbol };
            const text_12: string;
            export { text_12 as text };
        }
        namespace lightsleetshowersandthunder {
            const symbol_13: string;
            export { symbol_13 as symbol };
            const text_13: string;
            export { text_13 as text };
        }
        namespace sleetshowersandthunder {
            const symbol_14: string;
            export { symbol_14 as symbol };
            const text_14: string;
            export { text_14 as text };
        }
        namespace heavysleetshowersandthunder {
            const symbol_15: string;
            export { symbol_15 as symbol };
            const text_15: string;
            export { text_15 as text };
        }
        namespace lightsnowshowers {
            const symbol_16: string;
            export { symbol_16 as symbol };
            const text_16: string;
            export { text_16 as text };
        }
        namespace snowshowers {
            const symbol_17: string;
            export { symbol_17 as symbol };
            const text_17: string;
            export { text_17 as text };
        }
        namespace heavysnowshowers {
            const symbol_18: string;
            export { symbol_18 as symbol };
            const text_18: string;
            export { text_18 as text };
        }
        namespace lightsnowshowersandthunder {
            const symbol_19: string;
            export { symbol_19 as symbol };
            const text_19: string;
            export { text_19 as text };
        }
        namespace snowshowersandthunder {
            const symbol_20: string;
            export { symbol_20 as symbol };
            const text_20: string;
            export { text_20 as text };
        }
        namespace heavysnowshowersandthunder {
            const symbol_21: string;
            export { symbol_21 as symbol };
            const text_21: string;
            export { text_21 as text };
        }
        namespace lightrain {
            const symbol_22: string;
            export { symbol_22 as symbol };
            const text_22: string;
            export { text_22 as text };
        }
        namespace rain {
            const symbol_23: string;
            export { symbol_23 as symbol };
            const text_23: string;
            export { text_23 as text };
        }
        namespace heavyrain {
            const symbol_24: string;
            export { symbol_24 as symbol };
            const text_24: string;
            export { text_24 as text };
        }
        namespace lightrainandthunder {
            const symbol_25: string;
            export { symbol_25 as symbol };
            const text_25: string;
            export { text_25 as text };
        }
        namespace rainandthunder {
            const symbol_26: string;
            export { symbol_26 as symbol };
            const text_26: string;
            export { text_26 as text };
        }
        namespace heavyrainandthunder {
            const symbol_27: string;
            export { symbol_27 as symbol };
            const text_27: string;
            export { text_27 as text };
        }
        namespace lightsleet {
            const symbol_28: string;
            export { symbol_28 as symbol };
            const text_28: string;
            export { text_28 as text };
        }
        namespace sleet {
            const symbol_29: string;
            export { symbol_29 as symbol };
            const text_29: string;
            export { text_29 as text };
        }
        namespace heavysleet {
            const symbol_30: string;
            export { symbol_30 as symbol };
            const text_30: string;
            export { text_30 as text };
        }
        namespace lightsleetandthunder {
            const symbol_31: string;
            export { symbol_31 as symbol };
            const text_31: string;
            export { text_31 as text };
        }
        namespace sleetandthunder {
            const symbol_32: string;
            export { symbol_32 as symbol };
            const text_32: string;
            export { text_32 as text };
        }
        namespace heavysleetandthunder {
            const symbol_33: string;
            export { symbol_33 as symbol };
            const text_33: string;
            export { text_33 as text };
        }
        namespace lightsnow {
            const symbol_34: string;
            export { symbol_34 as symbol };
            const text_34: string;
            export { text_34 as text };
        }
        namespace snow {
            const symbol_35: string;
            export { symbol_35 as symbol };
            const text_35: string;
            export { text_35 as text };
        }
        namespace heavysnow {
            const symbol_36: string;
            export { symbol_36 as symbol };
            const text_36: string;
            export { text_36 as text };
        }
        namespace lightsnowandthunder {
            const symbol_37: string;
            export { symbol_37 as symbol };
            const text_37: string;
            export { text_37 as text };
        }
        namespace snowandthunder {
            const symbol_38: string;
            export { symbol_38 as symbol };
            const text_38: string;
            export { text_38 as text };
        }
        namespace heavysnowandthunder {
            const symbol_39: string;
            export { symbol_39 as symbol };
            const text_39: string;
            export { text_39 as text };
        }
        namespace fog {
            const symbol_40: string;
            export { symbol_40 as symbol };
            const text_40: string;
            export { text_40 as text };
        }
    }
}
declare const url: any;
