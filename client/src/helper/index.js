export const getDimentions = (parentContainerDimentions, aspect_ratio = "16:9", child_count = 1, heightOffset = 0) => {
    
    // 16:9, 4:3, 1:2, 1:1
    const margin = 4;
    let ratio = aspect_ratio.split(":");
    let { width, height } = parentContainerDimentions;
    let optimal_width = 0;

    ratio = ratio[1] / ratio[0];
    width = width - (margin * 2);
    height = height - (margin * 2);

    function calculate_optimal_width(new_width) {
        let calculated_width = 0;
        let calculated_height = new_width * ratio + (margin * 2);
        for(let i=0; i < child_count; i++){
            if ((calculated_width + new_width) > width) {
                calculated_width = 0;
                calculated_height = calculated_height + (new_width * ratio )+ (margin * 2);
            }
            calculated_width = calculated_width + new_width + (margin * 2);
        }

        if ((calculated_height + heightOffset) > height || new_width > width) {
            return (new_width - 1) - (margin * 2)
        }
        else return calculate_optimal_width(new_width + 1);
    }

    optimal_width = calculate_optimal_width(1);

    return {
        width: optimal_width,
        height: optimal_width * ratio
    }

}