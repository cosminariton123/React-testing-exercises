import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should not render anything if given empty array", () => {
    const { container } = render(
      <ProductImageGallery imageUrls={[]}></ProductImageGallery>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should render a list of images", () => {
    const imageUrls = ["url1", "url2", "url3"];
    render(<ProductImageGallery imageUrls={imageUrls}></ProductImageGallery>);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(imageUrls.length);
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url);
    });
  });
});
