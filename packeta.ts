import type { PacketaWidgetOptions, PacketaStandardWidgetOptions, PacketaHDWidgetOptions, PacketaWidgetCallback } from './types';

const packetaUrls = {
    errorUrl: 'https://error-page-service-widget-errors.prod.packeta-com.codenow.com/',
    
    pickupPoint: {
        baseUrl: 'https://widget.packeta.com/',
        backupUrl: 'https://backup.widget.packeta.com/',
        healthUrl: 'https://widget.packeta.com/v6/api/hcs/api/healthcheck/',
    },
    homeDelivery: {
        baseUrl: 'https://hd.widget.packeta.com/',
        backupUrl: 'https://backup.widget.packeta.com/',
        healthUrl: 'https://hd.widget.packeta.com/api/hcs/api/healthcheck/',
    },
    // I have no idea what this is for
    // carDelivery: {
    //     baseUrl: 'https://cd.widget.packeta.com/',
    //     backupUrl: 'https://backup.widget.packeta.com/',
    //     healthUrl: 'https://cardelivery.widget.packeta.com/v6/api/hcs/api/healthcheck',
    // }
}

async function checkServiceHealth(service: "pickupPoint" | "homeDelivery") {
    // Make a request to the health check URL and check the status
    const response = await fetch(packetaUrls[service].healthUrl, {
        method: 'GET',
    });

    // Return the health status
    return response.ok;
}

function destroyWidget() {
    // Remove the widget iframe from the document
    const widget = document.getElementById('packeta-widget');
    if (widget) {
        widget.remove();
    }

    // Remove the widget wrapper from the document
    const wrapper = document.getElementById('packeta-widget-wrapper');
    if (wrapper) {
        wrapper.remove();
    }
}

function isStandardOptions(options: PacketaWidgetOptions): options is PacketaStandardWidgetOptions {
    return options.widgetType == "pickupPoint";
}

function isHDOptions(options: PacketaWidgetOptions): options is PacketaHDWidgetOptions {
    return options.widgetType == "homeDelivery";
}

async function createWidget(options: PacketaWidgetOptions, callback: PacketaWidgetCallback) {
    // Set the layout option based on the widget type
    // Basically widgetType is replacement for this weird layout option
    // that's why is layout getting set depending on widgetType
    if (isHDOptions(options)) {
        options.layout = "hd";
    }

    // Check the health of the service based on the widget type
    const serviceHealthy = await checkServiceHealth(options.widgetType);

    // Determine the URL of the widget based on the health of the service
    let iframeUrl = "";
    if (serviceHealthy) {
        // Use the base URL if the service is healthy
        iframeUrl = packetaUrls[options.widgetType].baseUrl;
    } else {
        // Use the backup URL if the service is not healthy
        iframeUrl = packetaUrls[options.widgetType].backupUrl;
    }

    // Append the api version and start of the URL parameters to the URL
    iframeUrl += 'v6/#/?';

    // Loop through the options and append them to the iframe URL
    for (const [option, value] of Object.entries(options)) {
        // Append the option to the URL
        // Only append the option if it is a string, number, or boolean (skips values that can't be encoded)
        if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean')
            iframeUrl += "&" + option + "=" + encodeURIComponent(value);
    }

    // Create the widget iframe
    const iframe = document.createElement('iframe');
    // Set the attributes of the iframe
    iframe.setAttribute('src', iframeUrl);
    iframe.setAttribute('id', 'packeta-widget');
    iframe.setAttribute('sandbox', "allow-scripts allow-same-origin allow-popups");
    iframe.setAttribute('allow', "geolocation");
    iframe.setAttribute('allowfullscreen', "true");
    iframe.setAttribute('style', 'width: 100%; height: 100%; border: none;');

    // Add the iframe to the document
    if (options.inline) {
        // If the widget is inline, append it to the parent element
        if (!options.parentElement)
            throw new Error("Parent element is required for inline widget");

        const parentElement = options.parentElement;
        parentElement.appendChild(iframe);
    }
    else {
        // If the widget is not inline, create a wrapper and append the iframe to it
        const wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'packeta-widget-wrapper');
        wrapper.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; padding: 20px; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;');
        wrapper.appendChild(iframe);
        // Add an event listener to the wrapper to close the widget when clicked outside of it
        wrapper.addEventListener('click', (event) => {
            if (event.target === wrapper) {
                destroyWidget();
            }
        });
        // Append the wrapper to the document
        document.body.appendChild(wrapper);
    }

    // Add event listeners to the iframe to handle messages from the widget
    window.addEventListener('message', (event) => {
        // Check if the message is from the widget
        if (event.source !== iframe.contentWindow) {
            return;
        }

        let data = event.data;

        // Try to parse the data as json if it is a string
        // when delivery address is selected, the data is a string and not an object for some reason
        if (event.data && typeof event.data == 'string')
            data = JSON.parse(event.data);

        // Check if the message is a close message
        if (event.data?.closePacketaWidget) {
            destroyWidget();
            return;
        }

        callback(event.data);
        destroyWidget();
    });

}

class Packeta {
    apiKey: string;
    widgetOpen: boolean = false;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async openWidget(options: PacketaWidgetOptions, callback: PacketaWidgetCallback) {
        // Do not reopen the widget if it is already open
        if (document.getElementById('packeta-widget-wrapper') || document.getElementById('packeta-widget')) {
            return;
        }

        // Append the API key to the options
        options.apiKey = this.apiKey;

        // Create the widget
        await createWidget(options, callback);
    }

    closeWidget() {
        // Close the widget
        destroyWidget();
    }

}

export default Packeta;