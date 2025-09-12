-- Tony Stark insert
INSERT INTO public.account
	(
		account_firstname,
		account_lastname,
		account_email,
		account_password
	)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Tony Stark update
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Delete Tony Stark 
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

  -- The description update
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Select query using a JOIN
SELECT inv_make, inv_model, classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c
	ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';

-- The inv_image and inv_thumbnail update query 
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


