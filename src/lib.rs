use base64::engine::general_purpose;
use base64::Engine;
use image::ImageOutputFormat;
use image::{load_from_memory, DynamicImage, GenericImage, RgbImage};
use std::cmp;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

fn image_to_base64(img: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let base64 = general_purpose::STANDARD.encode(image_data);
    format!("data:image/png;base64,{}", base64)
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[wasm_bindgen]
pub fn console_log(msg: &str) {
    log(msg);
}

#[wasm_bindgen]
pub fn merge_image(first_buf: &[u8], second_buf: &[u8]) -> String {
    let first_img = load_from_memory(first_buf).unwrap().to_rgb8();
    let second_img = load_from_memory(second_buf).unwrap().to_rgb8();
    let (first_width, first_height) = first_img.dimensions();
    let (second_width, second_height) = second_img.dimensions();
    let mut result = RgbImage::from_fn(
        first_width + second_width,
        cmp::max(first_height, second_height),
        |_, _| image::Rgb([255, 255, 255]),
    );

    result
        .copy_from(
            &first_img,
            0,
            cmp::max((second_height as i32 - first_height as i32) / 2, 0) as u32,
        )
        .unwrap();
    result
        .copy_from(
            &second_img,
            first_width,
            cmp::max((first_height as i32 - second_height as i32) / 2, 0) as u32,
        )
        .unwrap();

    image_to_base64(&result.try_into().unwrap())
}

#[wasm_bindgen]
pub fn crop_image(image_buf: &[u8], x: u32, y: u32, width: u32, height: u32) -> String {
    let mut image = load_from_memory(image_buf).unwrap();
    let croped = image.crop(x, y, width, height);
    image_to_base64(&croped)
}
