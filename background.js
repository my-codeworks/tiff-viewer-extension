chrome.storage.local.get(['DecoderMemoryLimitInMegabytes','ShowDebugOutput'], function (options) {
    var DecoderMemoryLimitInbytes;
    if (options.DecoderMemoryLimitInMegabytes === undefined) {
        DecoderMemoryLimitInbytes = 32*1E6;
    } else {
        DecoderMemoryLimitInbytes = options.DecoderMemoryLimitInMegabytes*1E6 ;
    }
    Tiff.initialize({ TOTAL_MEMORY: DecoderMemoryLimitInbytes });

    // Disable console.log if ShowDebugOutput is false
    if (options.ShowDebugOutput !== true) {
        console.log = function() {};
    }
    
    function convert_binary_string_to_buffer( data ){
      var buffer, view, a_byte;

      buffer = new ArrayBuffer( data.length );
      view = new DataView( buffer );

      data.split( '' ).forEach( function( c, i ){
        a_byte = c.charCodeAt();
        view.setUint8( i, a_byte & 0xff );
      });

      return view.buffer;
    }

    function create_request_for_url( url ){
      var request;

      console.log( 'Starting XHR request for', url );
      request = new XMLHttpRequest();
      request.open( 'GET', url, false );
      request.overrideMimeType( 'text\/plain; charset=x-user-defined' );
      request.send( );
      console.log( 'Finished XHR request' );

      return request;
    }

    function get_buffer_from_url( url ){
      var request;

      request = create_request_for_url( url );
      
      if( request.status != 200 ){
        console.log( 'Exception', 'request for image failed', request );
        return url;
      }

      return convert_binary_string_to_buffer( request.responseText );
    }

    convert_buffer_to_dataurl = function( buffer ){
      var tiff;

      try {
        console.log( 'Opening tiff' );
        tiff = new Tiff({ buffer: buffer });
        console.log( 'Opened', 'width: ', tiff.width(), 'height: ', tiff.height(), tiff );
      } catch( e ){
        console.log( 'Exception', e );
        return;
      }

      return tiff.toDataURL();
    };

    function redirect_request_to_dataurl( details ){
      var url, buffer, dataURI;

      console.log( 'Entering', details );
      url = details.url;
      console.log( 'Loading', details.url );
      buffer = get_buffer_from_url( url );
      console.log( 'Loaded', buffer.byteLength, 'bytes of data' );
      dataURI = convert_buffer_to_dataurl( buffer );
      console.log( 'Converted', dataURI );

      return { redirectUrl: dataURI };
    }

    function content_type_tiff_header_filter( header ){
      var is_content_type_header, is_of_type_tiff;

      if( !header.name || !header.value ){ return false; }

      is_content_type_header = header.name.toLowerCase() === 'content-type';
      is_of_type_tiff = header.value.toLowerCase().indexOf( 'image/tiff' ) > -1;

      return is_content_type_header && is_of_type_tiff;
    }

    function content_type_header_is_tiff( headers ){
      var content_type_tiff_headers;

      content_type_tiff_headers = headers.filter( content_type_tiff_header_filter );

      return content_type_tiff_headers.length > 0;
    }

    function redirect_request_to_dataurl_if_response_content_type_is_tiff( details ){
      if( !content_type_header_is_tiff( details.responseHeaders ) ){ return; }

      details.responseHeaders.push({ name: 'Content-Type', value: 'image/png' });

      response = redirect_request_to_dataurl( details );
      response.responseHeaders = details.responseHeaders;

      return response;
    }

    chrome.webRequest.onBeforeRequest.addListener(
      redirect_request_to_dataurl,
      {
        urls: [ "*://*/*.tiff", "*://*/*.tif", "*://*/*.Tiff", "*://*/*.Tif", "*://*/*.TIFF", "*://*/*.TIF" ],
        types: [ 'main_frame', 'sub_frame', 'image' ]
      },
      [ 'blocking' ]
    );

    chrome.webRequest.onHeadersReceived.addListener(
      redirect_request_to_dataurl_if_response_content_type_is_tiff,
      {
        urls: [ '<all_urls>' ],
        types: [ 'main_frame', 'sub_frame', 'image' ]
      },
      [ 'blocking', 'responseHeaders' ]
    );
});