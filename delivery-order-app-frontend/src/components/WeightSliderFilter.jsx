import { Form } from 'react-bootstrap'; 
import { Range } from 'react-range';
const WeightSliderFilter = ({
    minCargoWeight,
    maxCargoWeight,
    dataMinWeight,
    dataMaxWeight,
    onDisplayWeightChange,
    onActualWeightChange,
    displayMinWeight,
    displayMaxWeight,
}) => {
    return (
        <Form.Group className="form-group"> 
            <Form.Label className="form-label">Вес груза, кг:</Form.Label>
            <div className="weight-inputs-container">
                <Form.Control
                    type="number"
                    value={displayMinWeight}
                    onChange={(e) => onDisplayWeightChange([Number(e.target.value), displayMaxWeight])}
                    className="form-control" 
                />
                <Form.Control
                    type="number"
                    value={displayMaxWeight}
                    onChange={(e) => onDisplayWeightChange([displayMinWeight, Number(e.target.value)])}
                    className="form-control" 
                />
            </div>
            <div className="range-slider-wrapper">
                <Range
                    values={[displayMinWeight, displayMaxWeight]}
                    step={1}
                    min={dataMinWeight}
                    max={dataMaxWeight}
                    onChange={onDisplayWeightChange}
                    onFinalChange={onActualWeightChange}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: '8px',
                                width: '100%',
                                backgroundColor: '#ccc',
                                borderRadius: '4px',
                            }}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props, isDragged }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: '24px',
                                width: '24px',
                                backgroundColor: isDragged ? '#007bff' : 'white',
                                border: '2px solid #007bff',
                                borderRadius: '50%',
                                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                    )}
                />
            </div>
        </Form.Group>
    );
};

export default WeightSliderFilter;