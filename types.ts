// Data structures from https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-data-structures

// https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-vendor
export type PacketaVendor = {
    carrierId: string;
    country: string;
    group: string;
    selected: boolean;
    price: number;
    currency: string;
}

// https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-options
export type PacketaStandardWidgetOptions = {
    // Options for the pickup point widget
    // Custom properties
    widgetType: "pickupPoint" | "homeDelivery";
    inline?: boolean;
    parentElement?: HTMLElement;

    // Standard options
    webUrl?: string;
    appIdentity?: string;
    vendors?: PacketaVendor[];
    country?: string;
    carriers?: string;
    language?: string;
    claimAssistant?: string;
    packetConsignment?: string;
    weight?: number;
    length?: number;
    width?: number;
    depth?: number;
    longitude?: number;
    latitude?: number;
    livePickupPoint?: boolean;
    expeditionDay?: string;
    defaultPrice?: string;
    centerExternalId?: string;

    // Options not specified in the documentation but are required
    apiKey?: string;
}

// https://docs.packetery.com/07-home-delivery/01-impl-man.html#toc-hd-options
export type PacketaHDWidgetOptions = {
    // Options for the home delivery widget
    // Custom properties
    widgetType: "pickupPoint" | "homeDelivery";
    inline?: boolean;
    parentElement?: HTMLElement;

    // HD options
    layout: string;
    carrierId: string;
    language?: string;
    country?: string;
    centerCountry?: string;
    centerRegion?: string;
    centerCity?: string;
    centerPostcode?: string;
    centerStreet?: string;
    centerHouseNumber?: string;

    // Options not specified in the documentation but are required
    apiKey?: string;
}

export type PacketaWidgetOptions = PacketaStandardWidgetOptions | PacketaHDWidgetOptions

// https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-time
export type PacketaTime = {
    open: string;
    close: string;
}

// https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-exceptionday
export type PacketaExpeditionDay = {
    from: string;
    to: string;
    times: PacketaTime[];
}

// https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-photo
export type PacketaPhoto = {
    thumbnail: string;
    normal: string;
}

// https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-weekhours
export type PacketaWeekHours = {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
}

// https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-pointhours
export type PacketaPointHours = {
    compactShort: string;
    compactLong: string;
    tableLong: string;
    regular: PacketaWeekHours;
}

// https://docs.packetery.com/01-pickup-point-selection/02-widget-v6.html#toc-point
export type PacketaPoint = {
    id: string;
    name: string;
    country: string;
    currency: string;
    plate: string;
    special: string;
    street: string;
    city: string;
    zip: string;
    gps: string;
    packetConsignment: boolean;
    claimAssistant: boolean;
    maxWeight: number;
    error: null | "vacation" | "full" | "closing" | "technical";
    warning: null | "almostFull";
    recommended: null | "quick";
    isNew: boolean;
    creditCardPayment: null | boolean;
    saturdayOpenTo: number;
    sundayOpenTo: number;
    businessDaysOpenUpTo: number;
    businessDaysOpenLunchtime: boolean;
    directions: string;
    directionsCar: string;
    directionsPublic: string;
    holidayStart: null | string;
    holidayEnd: null | string;
    exceptionDays: PacketaExpeditionDay[];
    wheelchairAccessible: boolean;
    url: string;
    branchCode: string;
    photo: PacketaPhoto[];
    openingHours: PacketaPointHours[];
    pickupPointType: string;
    routingCode: string;
    carrierId: string;
    carrierPickupPointId: string;
    group: string;
    externalId: string;
}

// Data structures from https://docs.packetery.com/07-home-delivery/01-impl-man.html#toc-hd-data-structures

// https://docs.packetery.com/07-home-delivery/01-impl-man.html#toc-hd-address
export type PacketaAddress = {
    country: string;
    region: string;
    city: string;
    postcode: string;
    street: string;
    houseNumber: string;
    latitude: string;
    longitude: string;
}

// Other types not specified in the documentation
export type PacketaWidgetCallback = ((point: PacketaPoint) => void) | ((address: PacketaAddress) => void);