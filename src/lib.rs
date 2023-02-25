use base64::engine::general_purpose;
use base64::Engine;
use image::io::Reader;
use image::{load_from_memory, DynamicImage, GenericImage, RgbImage};
use image::{GenericImageView, ImageOutputFormat};
use std::cmp;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

fn image_to_base64(img: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let base64 = general_purpose::STANDARD.encode(image_data);
    base64
}

fn base64_to_image(base64_string: &str) -> DynamicImage {
    let decoded_data = general_purpose::STANDARD.decode(base64_string).unwrap();
    let cursor = Cursor::new(decoded_data);
    let image = Reader::new(cursor)
        .with_guessed_format()
        .expect("failed to guess image format")
        .decode()
        .expect("failed to decode image");
    image
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
pub fn crop_image(
    image_buf: String,
    x_percent: u32,
    y_percent: u32,
    width_percent: u32,
    height_percent: u32,
) -> String {
    let image = base64_to_image(&image_buf);
    let (width, height) = image.dimensions();
    let x_pix = (width as f64 / 100.0) * x_percent as f64;
    let y_pix = (height as f64 / 100.0) * y_percent as f64;
    let width_pix = (width as f64 / 100.0) * width_percent as f64;
    let height_pix = (height as f64 / 100.0) * height_percent as f64;
    let croped = image.crop_imm(
        x_pix.round() as u32,
        y_pix.round() as u32,
        width_pix.round() as u32,
        height_pix.round() as u32,
    );
    image_to_base64(&croped)
}
