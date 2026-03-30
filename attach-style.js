export const attachTileSelectorStyle = () => {
  const STYLE_ID = 'tile-selector-styles';
  
  if (document.getElementById(STYLE_ID)) return;
  
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #tile-selector {
      .selection-box {
        fill: #FFFFFF36 !important;
        stroke: #38A658;
        stroke: green;
        filter: brightness(1.2) drop-shadow(0 0px 0.075px #0000007A);
      }
    
      .selection-handle {
        fill: #FFFFFF !important;
        stroke: #FFFFFF00;
        filter: contrast(1) drop-shadow(0 0px 0.125px #000000AD);
        r: 0.25;
        transition: r 0.16s;
      }
    
      .selection-handle[data-role=focus] {
        fill: green !important;
        r: 0.35;
        filter: contrast(1.3) drop-shadow(0 0px 0.026px #000000AD);
      }
    
      .selection-handle[data-role=anchor] {
        fill: green !important;
        r: 0.35;
        filter: contrast(1.3) drop-shadow(0 0px 0.026px #000000AD);
      }
    }
  
    #tile-selector[data-is-dragging=true] {
      .selection-handle {
        opacity: 0;
      }
      
      .selection-box {
        stroke-width: 0.15px;
        filter: brightness(1.2) drop-shadow(0 0px 0.125px #000000AD);
      }
    }
    
    .line-outline {
      fill: rgba(221, 255, 0, 0.21);
      stroke: #FF0069;
      stroke-width: 0.1;
      
    }
  `;
  
  document.head.appendChild(style);
}